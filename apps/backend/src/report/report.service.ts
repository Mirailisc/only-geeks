import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Report, ReportStatus, TargetType } from './entities/report.entity'
import { CreateReportInput } from './dto/create-report.input'

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllMyReports(userId: string): Promise<Report[]> {
    return await this.prisma.report.findMany({
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        userReport: {
          include: {
            target: true,
            report: {
              include: {
                reporter: true,
                decision: {
                  include: {
                    admin: true,
                  },
                },
              },
            },
          },
        },
        blogReport: {
          include: {
            target: true,
            report: {
              include: {
                reporter: true,
                decision: {
                  include: {
                    admin: true,
                  },
                },
              },
            },
          },
        },
        projectReport: {
          include: {
            target: true,
            report: {
              include: {
                reporter: true,
                decision: {
                  include: {
                    admin: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        reporterId: userId,
      },
    })
  }

  async findAllMyWarnings(userId: string): Promise<Report[]> {
    return await this.prisma.report.findMany({
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        userReport: {
          include: {
            target: true,
            report: {
              include: {
                reporter: true,
                decision: {
                  include: {
                    admin: true,
                  },
                },
              },
            },
          },
        },
        blogReport: {
          include: {
            target: true,
            report: {
              include: {
                reporter: true,
                decision: {
                  include: {
                    admin: true,
                  },
                },
              },
            },
          },
        },
        projectReport: {
          include: {
            target: true,
            report: {
              include: {
                reporter: true,
                decision: {
                  include: {
                    admin: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        OR: [
          {
            userReport: { target: { id: userId } },
          },
          {
            blogReport: { target: { userId: userId } },
          },
          {
            projectReport: { target: { userId: userId } },
          },
        ],
      },
    })
  }

  async createReport(
    input: CreateReportInput,
    userId: string,
  ): Promise<Report> {
    return await this.prisma.report.create({
      data: {
        reporterId: userId,
        category: input.category,
        reason: input.reason,
        status: 'PENDING', // optional, default is already PENDING
        // nested create for target
        userReport:
          input.targetType === 'USER'
            ? {
                create: {
                  targetId: input.targetId,
                },
              }
            : undefined,
        blogReport:
          input.targetType === 'BLOG'
            ? {
                create: {
                  targetId: input.targetId,
                },
              }
            : undefined,
        projectReport:
          input.targetType === 'PROJECT'
            ? {
                create: {
                  targetId: input.targetId,
                },
              }
            : undefined,
      },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        userReport: {
          include: {
            target: true,
            report: {
              include: {
                reporter: true,
                decision: {
                  include: {
                    admin: true,
                  },
                },
              },
            },
          },
        },
        blogReport: {
          include: {
            target: true,
            report: {
              include: {
                reporter: true,
                decision: {
                  include: {
                    admin: true,
                  },
                },
              },
            },
          },
        },
        projectReport: {
          include: {
            target: true,
            report: {
              include: {
                reporter: true,
                decision: {
                  include: {
                    admin: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  async getAllReports(): Promise<Report[]> {
    return await this.prisma.report.findMany({
      include: {
        reporter: true,
        decision: { include: { admin: true } },
      },
    })
  }

  async getAllReportsByStatus(status: ReportStatus): Promise<Report[]> {
    if (status === 'ALL') {
      return await this.prisma.report.findMany({
        include: {
          reporter: true,
          decision: { include: { admin: true } },
        },
      })
    }
    return await this.prisma.report.findMany({
      where: { status },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
      },
    })
  }

  async findReportById(id: string): Promise<Report> {
    return await this.prisma.report.findUnique({
      where: { id },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
      },
    })
  }

  async updateReportStatus(id: string, status: ReportStatus): Promise<Report> {
    if (status === 'ALL') {
      throw new Error('Invalid status update')
    }
    return await this.prisma.report.update({
      where: { id },
      data: { status },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
      },
    })
  }

  async deleteReport(id: string): Promise<Report> {
    return await this.prisma.report.delete({
      where: { id },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
      },
    })
  }

  async countReportsByStatus(): Promise<
    {
      status: ReportStatus
      count: number
    }[]
  > {
    const result = await this.prisma.report.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    return result.map((r) => ({
      status: r.status,
      count: r._count.status,
    }))
  }

  async amIReportThis(
    userId: string,
    targetType: TargetType,
    targetId: string,
  ): Promise<boolean> {
    const report = await this.prisma.report.findFirst({
      where: {
        reporterId: userId,
        AND: [
          targetType === 'USER'
            ? { userReport: { targetId } }
            : targetType === 'BLOG'
              ? { blogReport: { targetId } }
              : targetType === 'PROJECT'
                ? { projectReport: { targetId } }
                : {},
        ],
      },
    })

    return !!report
  }
}
