import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FeedInput, FeedType } from './dto/feed.input'

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async search(input: FeedInput) {
    const { limit, cursor, type } = input
    const cursorDate = cursor ? new Date(cursor) : undefined

    // Helper to apply cursor filter
    const cursorFilter = cursorDate ? { createdAt: { lt: cursorDate } } : {}

    // Fetch items per type
    const feedItems: any[] = []

    if (type === FeedType.ALL || type === FeedType.PROJECT) {
      const projects = await this.prisma.project.findMany({
        where: { ...cursorFilter },
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

    if (type === FeedType.ALL || type === FeedType.BLOG) {
      const blogs = await this.prisma.blog.findMany({
        where: { isPublished: true, ...cursorFilter },
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

    if (type === FeedType.ALL || type === FeedType.AWARD) {
      const achievements = await this.prisma.achievement.findMany({
        where: { ...cursorFilter },
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

    // Sort all by createdAt desc
    feedItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Slice to requested limit
    const items = feedItems.slice(0, limit)

    // Determine next cursor (ISO string of the last item)
    const nextCursor =
      items.length > 0 ? items[items.length - 1].createdAt.toISOString() : null

    const returnItem = {
      items,
      nextCursor,
    }
    console.log(returnItem)
    return returnItem
  }
}
