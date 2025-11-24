import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateBlogInput } from './dto/create-blog.input'
import { UserService } from 'src/user/user.service'
import { UpdateBlogInput } from './dto/update-blog.input'
import { AdminService } from 'src/admin/admin.service'
import { Blog } from './entities/blog.entity'

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  async getBlogs() {
    return await this.prisma.blog.findMany({
      where: {
        isPublished: true,
        User: { isActive: true },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }

  async getMyBlogs(userId: string): Promise<Blog[]> {
    const myBlog = await this.prisma.blog.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
        reports: {
          include: {
            report: {
              include: {
                decision: true,
              },
            },
          },
        },
      },
    })

    return myBlog.map((b) => {
      const decisions = b.reports
        .map((pr) => pr.report.decision?.action)
        .filter(Boolean)
      return {
        ...b,
        contentType: 'blog',
        isResponse: b.reports.some(
          (r) => r.report.decision?.isResponse || false,
        ),
        requestEdit: decisions.includes('REQUEST_EDIT'),
        requestUnpublish: decisions.includes('UNPUBLISH'),
      }
    })
  }

  async getBlogById(id: string): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({
      where: { id, User: { isActive: true } },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
        reports: {
          include: {
            report: {
              include: {
                decision: true,
              },
            },
          },
        },
      },
    })

    const decisions = blog.reports
      .map((pr) => pr.report.decision?.action)
      .filter(Boolean)
    return {
      ...blog,
      isResponse: blog.reports.some(
        (r) => r.report.decision?.isResponse || false,
      ),
      requestEdit: decisions.includes('REQUEST_EDIT'),
      requestUnpublish: decisions.includes('UNPUBLISH'),
    }
  }

  async getBlogsByUsername(username: string): Promise<Blog[]> {
    const user = await this.userService.findUserByUsername(username)

    const blog = await this.prisma.blog.findMany({
      where: {
        userId: user.id,
        isPublished: true,
        // exclude projects that have reports with UNPUBLISH or REQUEST_EDIT
        reports: {
          none: {
            report: {
              decision: {
                action: {
                  in: ['UNPUBLISH', 'REQUEST_EDIT'],
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
        reports: {
          include: {
            report: {
              include: {
                decision: true,
              },
            },
          },
        },
      },
    })

    return blog.map((b) => {
      const decisions = b.reports
        .map((pr) => pr.report.decision?.action)
        .filter(Boolean)
      return {
        ...b,
        isResponse: b.reports.some(
          (r) => r.report.decision?.isResponse || false,
        ),
        requestEdit: decisions.includes('REQUEST_EDIT'),
        requestUnpublish: decisions.includes('UNPUBLISH'),
      }
    })
  }

  async getBlogBySlugAndUsername(
    slug: string,
    username: string,
    currentUserId: string = null,
  ): Promise<Blog> {
    const user = await this.userService.findUserByUsername(username)
    if (!user) throw new Error('BLOG_NOT_FOUND')
    if (!user.preference.isPublicProfile && user.id !== currentUserId) {
      throw new Error('BLOG_NOT_FOUND')
    }
    const result = await this.prisma.blog.findUnique({
      where: {
        userId_slug: { userId: user.id, slug },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
        reports: {
          include: {
            report: {
              include: {
                decision: true,
              },
            },
          },
        },
      },
    })
    if (!result || (result && !result.isPublished))
      throw new Error('BLOG_NOT_FOUND')
    const decisions = result.reports
      .map((pr) => pr.report.decision?.action)
      .filter(Boolean)
    if (decisions.includes('UNPUBLISH') && result.userId !== currentUserId) {
      throw new Error('BLOG_NOT_FOUND')
    }
    if (decisions.includes('REQUEST_EDIT') && result.userId !== currentUserId) {
      throw new Error('BLOG_NOT_FOUND')
    }
    return {
      ...result,
      isResponse: result.reports.some(
        (r) => r.report.decision?.isResponse || false,
      ),
      requestEdit: decisions.includes('REQUEST_EDIT'),
      requestUnpublish: decisions.includes('UNPUBLISH'),
    }
  }

  async createBlog(userId: string, input: CreateBlogInput) {
    await this.userService.checkPostingRestriction(userId)

    let slug = input.title.toLowerCase().replace(/\s+/g, '-')
    // Check if slug already exists for the user
    const existingSlugs = await this.prisma.blog.findMany({
      where: {
        userId,
        slug: { startsWith: slug },
      },
      select: { slug: true },
    })

    const slugSet = new Set(existingSlugs.map((b) => b.slug))

    let newSlug = slug
    let counter = 1

    // 3. Increment locally until we find a unique slug
    while (slugSet.has(newSlug)) {
      newSlug = `${slug}-${counter}`
      counter++
    }

    // 4. Update title and slug if it not the first untitled blog
    if (counter - 1 !== 0) {
      input.title = `${input.title} ${counter - 1}`
      slug = newSlug
    }

    return await this.prisma.blog.create({
      data: {
        ...input,
        userId,
        slug,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }

  async updateBlog(id: string, userId: string, input: UpdateBlogInput) {
    await this.userService.checkPostingRestriction(userId)

    const slug = input.title.toLowerCase().replace(/\s+/g, '-')

    const existing = await this.prisma.blog.findUnique({
      where: { id },
      include: { reports: true },
    })
    if (!existing) throw new Error('BLOG_NOT_FOUND')

    const moderationDecisions = await Promise.all(
      existing.reports.map((r) =>
        this.adminService.getModerationDecisionByReportId(r.reportId),
      ),
    )

    // Filter only decisions (REQUEST_EDIT or UNPUBLISH) that are not yet responded
    const pendingDecisions = moderationDecisions.filter(
      (d) =>
        d &&
        (d.action === 'REQUEST_EDIT' || d.action === 'UNPUBLISH') &&
        !d.isResponse,
    )

    if (pendingDecisions.length > 0) {
      await Promise.all(
        pendingDecisions.map((d) =>
          this.adminService.markModerationDecisionAsResponded(d.id),
        ),
      )
    }

    return await this.prisma.blog.update({
      where: { id },
      data: { ...input, slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }

  async deleteBlog(id: string, userId: string) {
    await this.userService.checkPostingRestriction(userId)

    //Double check if blog exists
    const existing = await this.prisma.blog.findUnique({
      where: { id },
    })
    if (!existing) throw new Error('BLOG_NOT_FOUND')

    //Delete associated reports and moderation decisions
    const reports = await this.prisma.blogReport.findMany({
      where: { targetId: id },
    })

    const reportIds = reports.map((r) => r.reportId)

    await this.prisma.moderationDecision.deleteMany({
      where: { reportId: { in: reportIds } },
    })

    await this.prisma.blogReport.deleteMany({
      where: { targetId: id },
    })

    await this.prisma.report.deleteMany({
      where: { id: { in: reportIds } },
    })

    //Delete blog
    return await this.prisma.blog.delete({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }
}
