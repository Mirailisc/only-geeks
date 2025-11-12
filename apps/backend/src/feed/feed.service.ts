import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FeedInput, FeedType } from './dto/feed.input'

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async search(input: FeedInput, userId?: string) {
    const { limit, cursor, type } = input
    const cursorDate = cursor ? new Date(cursor) : undefined
    const cursorFilter = cursorDate ? { createdAt: { lt: cursorDate } } : {}

    const feedItems: any[] = []

    // Helper for filtering by public/private profile
    const profileFilter = {
      OR: [
        // Public profiles
        { User: { preference: { isPublicProfile: true } } },
        // No preference set (assume public)
        { User: { preference: { isPublicProfile: undefined } } },
        // Content owned by the requester (even if private)
        ...(userId ? [{ userId }] : []),
      ],
    }

    // PROJECTS
    if (type === FeedType.ALL || type === FeedType.PROJECT) {
      const projects = await this.prisma.project.findMany({
        where: {
          ...cursorFilter,
          ...profileFilter,
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          title: true,
          description: true,
          link: true,
          photos: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          updatedAt: true,
          User: true,
        },
        take: limit,
      })
      feedItems.push(...projects.map((p) => ({ ...p, contentType: 'project' })))
    }

    // BLOGS
    if (type === FeedType.ALL || type === FeedType.BLOG) {
      const blogs = await this.prisma.blog.findMany({
        where: {
          isPublished: true,
          ...cursorFilter,
          ...profileFilter,
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          slug: true,
          title: true,
          content: true,
          description: true,
          thumbnail: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          User: true,
        },
        take: limit,
      })
      feedItems.push(...blogs.map((b) => ({ ...b, contentType: 'blog' })))
    }

    // ACHIEVEMENTS
    if (type === FeedType.ALL || type === FeedType.AWARD) {
      const achievements = await this.prisma.achievement.findMany({
        where: {
          ...cursorFilter,
          ...profileFilter,
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          title: true,
          description: true,
          issuer: true,
          date: true,
          photos: true,
          createdAt: true,
          updatedAt: true,
          User: true,
        },
        take: limit,
      })
      feedItems.push(
        ...achievements.map((a) => ({ ...a, contentType: 'achievement' })),
      )
    }

    // Sort & paginate
    feedItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    const items = feedItems.slice(0, limit)
    const nextCursor =
      items.length > 0 ? items[items.length - 1].createdAt.toISOString() : null

    return { items, nextCursor }
  }

  async getCountNewItems(since: Date, userId?: string) {
    const profileFilter = {
      OR: [
        { User: { preference: { isPublicProfile: true } } },
        { User: { preference: { isPublicProfile: undefined } } },
        ...(userId ? [{ userId }] : []),
      ],
    }

    const blogCount = await this.prisma.blog.count({
      where: {
        isPublished: true,
        createdAt: { gt: since },
        ...profileFilter,
      },
    })

    const projectCount = await this.prisma.project.count({
      where: {
        createdAt: { gt: since },
        ...profileFilter,
      },
    })

    const achievementCount = await this.prisma.achievement.count({
      where: {
        createdAt: { gt: since },
        ...profileFilter,
      },
    })

    return blogCount + projectCount + achievementCount
  }
}
