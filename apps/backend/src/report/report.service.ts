import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  Report,
  ReportsCountSummary,
  ReportStatus,
  TargetType,
} from './entities/report.entity'
import { CreateReportInput } from './dto/create-report.input'

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  private includes = {
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
        target: {
          include: {
            User: true,
          },
        },
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
        target: {
          include: {
            User: true,
          },
        },
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
  }
  async addTargetTypeToReports(report: Report): Promise<Report> {
    if (report.userReport) {
      return {
        targetType: TargetType.USER,
        ...report,
      } as unknown as Report
    }
    if (report.blogReport) {
      return {
        targetType: TargetType.BLOG,
        ...report,
      } as unknown as Report
    }
    if (report.projectReport) {
      return {
        targetType: TargetType.PROJECT,
        ...report,
      } as unknown as Report
    }
    return report
  }
  async addTargetTypeToReportsArray(reportList: Report[]): Promise<Report[]> {
    const reportsWithTargetType = reportList.map((report) => {
      return this.addTargetTypeToReports(report)
    })
    return reportsWithTargetType as unknown as Report[]
  }
  async findAllMyReports(userId: string): Promise<Report[]> {
    const reports = await this.prisma.report.findMany({
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        ...this.includes,
      },
      where: {
        reporterId: userId,
      },
    })
    return await this.addTargetTypeToReportsArray(
      reports as unknown as Report[],
    )
  }

  async findAllMyWarnings(userId: string): Promise<Report[]> {
    const reports = await this.prisma.report.findMany({
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        ...this.includes,
      },
      where: {
        AND: [
          {
            status: {
              in: ['RESOLVED', 'UNDER_REVIEW'],
            },
          },
          {
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
        ],
      },
    })
    return await this.addTargetTypeToReportsArray(
      reports as unknown as Report[],
    )
  }

  async createReport(
    input: CreateReportInput,
    userId: string,
  ): Promise<Report> {
    const report = await this.prisma.report.create({
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
        ...this.includes,
      },
    })
    return this.addTargetTypeToReports(report as unknown as Report)
  }
  async getAllReports(): Promise<Report[]> {
    const reports = await this.prisma.report.findMany({
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        ...this.includes,
      },
    })
    return await this.addTargetTypeToReportsArray(
      reports as unknown as Report[],
    )
  }

  async getAllReportsByStatus(status: ReportStatus): Promise<Report[]> {
    if (status === ReportStatus.ALL) {
      const reports = await this.prisma.report.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          reporter: true,
          decision: { include: { admin: true } },
          ...this.includes,
        },
      })
      return await this.addTargetTypeToReportsArray(
        reports as unknown as Report[],
      )
    }
    const reports = await this.prisma.report.findMany({
      where: { status },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        ...this.includes,
      },
    })
    return await this.addTargetTypeToReportsArray(
      reports as unknown as Report[],
    )
  }
  async getAllReportByType(targetType: TargetType): Promise<Report[]> {
    let reports: any[] = []
    if (targetType === TargetType.USER) {
      reports = await this.prisma.report.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: { userReport: { isNot: null } },
        include: {
          reporter: true,
          decision: { include: { admin: true } },
          ...this.includes,
        },
      })
    } else if (targetType === TargetType.BLOG) {
      reports = await this.prisma.report.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: { blogReport: { isNot: null } },
        include: {
          reporter: true,
          decision: { include: { admin: true } },
          ...this.includes,
        },
      })
    } else if (targetType === TargetType.PROJECT) {
      reports = await this.prisma.report.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: { projectReport: { isNot: null } },
        include: {
          reporter: true,
          decision: { include: { admin: true } },
          ...this.includes,
        },
      })
    }
    return await this.addTargetTypeToReportsArray(
      reports as unknown as Report[],
    )
  }
  async findReportById(id: string): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        ...this.includes,
      },
    })
    return report as unknown as Report
  }

  async updateReportStatus(id: string, status: ReportStatus): Promise<Report> {
    if (status === ReportStatus.ALL) {
      throw new Error('Cannot update report to ALL status')
    }
    const report = await this.prisma.report.update({
      where: { id },
      data: { status },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        ...this.includes,
      },
    })

    return await this.addTargetTypeToReports(report as unknown as Report)
  }

  async deleteReport(id: string): Promise<Report> {
    const report = await this.prisma.report.delete({
      where: { id },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
      },
    })
    return await this.addTargetTypeToReports(report as unknown as Report)
  }

  async countReportsByStatus(): Promise<ReportsCountSummary> {
    const result = await this.prisma.report.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    // Initialize summary with zero
    const summary: ReportsCountSummary = {
      PENDING: 0,
      UNDER_REVIEW: 0,
      RESOLVED: 0,
      REJECTED: 0,
      REQUEST_EDIT: 0,
      ALL: 0,
    }

    result.forEach((r) => {
      const key = r.status as keyof ReportsCountSummary
      summary[key] = r._count.status
      summary.ALL += r._count.status
    })

    return summary
  }

  async getRecentReports(limit: number): Promise<Report[]> {
    const reports = await this.prisma.report.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
        ...this.includes,
      },
    })
    return await this.addTargetTypeToReportsArray(
      reports as unknown as Report[],
    )
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
