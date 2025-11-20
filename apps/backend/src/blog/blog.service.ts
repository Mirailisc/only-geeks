import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateBlogInput } from './dto/create-blog.input'
import { UserService } from 'src/user/user.service'
import { UpdateBlogInput } from './dto/update-blog.input'
import { AdminService } from 'src/admin/admin.service'

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

  async getMyBlogs(userId: string) {
    return await this.prisma.blog.findMany({
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
      },
    })
  }

  async getBlogById(id: string) {
    return await this.prisma.blog.findUnique({
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
        reports: true,
      },
    })
  }

  async getBlogsByUsername(username: string) {
    const user = await this.userService.findUserByUsername(username)

    return await this.prisma.blog.findMany({
      where: { userId: user.id, isPublished: true },
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

  async getBlogBySlugAndUsername(
    slug: string,
    username: string,
    currentUserId: string = null,
  ) {
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
      },
    })
    if (!result || (result && !result.isPublished))
      throw new Error('BLOG_NOT_FOUND')
    return result
  }

  async createBlog(userId: string, input: CreateBlogInput) {
    await this.userService.checkPostingRestriction(userId)

    const slug = input.title.toLowerCase().replace(/\s+/g, '-')

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

    const existing = await this.getBlogById(id)
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
