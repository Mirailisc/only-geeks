import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FeedInput, FeedType } from './dto/feed.input'
import { gunzipSync } from 'zlib'

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
        {
          User: {
            isActive: true,
            preference: {
              is: {
                isPublicProfile: true,
              },
            },
          },
        },
        // No preference row → assume public
        {
          User: {
            isActive: true,
            preference: {
              is: null,
            },
          },
        },
        // Owner can see their own content
        ...(userId ? [{ userId }] : []),
      ],
    }
    // PROJECTS
    if (type === FeedType.ALL || type === FeedType.PROJECT) {
      const projects = await this.prisma.project.findMany({
        where: {
          ...cursorFilter,
          ...profileFilter,
          AND: [
            {
              OR: [
                // Owner always sees their own projects
                userId ? { userId } : {},

                // Everyone else: hide projects with REQUEST_EDIT or UNPUBLISH reports
                {
                  reports: {
                    none: {
                      report: {
                        decision: {
                          action: { in: ['REQUEST_EDIT', 'UNPUBLISH'] },
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
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
        take: limit,
      })

      feedItems.push(
        ...projects.map((p) => {
          const decisions = p.reports
            .map((pr) => pr.report.decision?.action)
            .filter(Boolean)
          return {
            ...p,
            contentType: 'project',
            isResponse: p.reports.some(
              (r) => r.report.decision?.isResponse || false,
            ),
            requestEdit: decisions.includes('REQUEST_EDIT'),
            requestUnpublish: decisions.includes('UNPUBLISH'),
          }
        }),
      )
    }

    // BLOGS
    if (type === FeedType.ALL || type === FeedType.BLOG) {
      const blogs = await this.prisma.blog.findMany({
        where: {
          isPublished: true,
          ...cursorFilter,
          ...profileFilter,
          AND: [
            {
              OR: [
                // Owner always sees their own projects
                userId ? { userId } : {},

                // Everyone else: hide projects with REQUEST_EDIT or UNPUBLISH reports
                {
                  reports: {
                    none: {
                      report: {
                        decision: {
                          action: { in: ['REQUEST_EDIT', 'UNPUBLISH'] },
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
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
        take: limit,
      })
      // feedItems.push(...blogs.map((b) => ({ ...b, contentType: 'blog' })))
      feedItems.push(
        ...blogs.map((b) => {
          const decisions = b.reports
            .map((pr) => pr.report.decision?.action)
            .filter(Boolean)
          const compressedContent = b.content
          const decompressedContent = compressedContent
            ? gunzipSync(compressedContent).toString('utf8')
            : null
          return {
            ...b,
            content: decompressedContent,
            contentType: 'blog',
            isResponse: b.reports.some(
              (r) => r.report.decision?.isResponse || false,
            ),
            requestEdit: decisions.includes('REQUEST_EDIT'),
            requestUnpublish: decisions.includes('UNPUBLISH'),
          }
        }),
      )
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
        { User: { preference: { is: { isPublicProfile: true } } } },
        { User: { preference: { is: { isPublicProfile: undefined } } } },
        ...(userId ? [{ userId }] : []),
      ],
    }

    const blogCount = await this.prisma.blog.count({
      where: {
        isPublished: true,
        createdAt: { gt: since },
        ...profileFilter,
        AND: [
          {
            OR: [
              // Owner always sees their own projects
              userId ? { userId } : {},

              // Everyone else: hide projects with REQUEST_EDIT or UNPUBLISH reports
              {
                reports: {
                  none: {
                    report: {
                      decision: {
                        action: { in: ['REQUEST_EDIT', 'UNPUBLISH'] },
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    })

    const projectCount = await this.prisma.project.count({
      where: {
        createdAt: { gt: since },
        ...profileFilter,
        AND: [
          {
            OR: [
              // Owner always sees their own projects
              userId ? { userId } : {},

              // Everyone else: hide projects with REQUEST_EDIT or UNPUBLISH reports
              {
                reports: {
                  none: {
                    report: {
                      decision: {
                        action: { in: ['REQUEST_EDIT', 'UNPUBLISH'] },
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
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
