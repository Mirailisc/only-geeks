import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Report, ReportStatus, TargetType } from './entities/report.entity'
import { CreateReportInput } from './dto/create-report.input'

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllMyReports(userId: string): Promise<Report[]> {
    return await this.prisma.report.findMany({
      where: { reporterId: userId },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
      },
    })
  }

  async findAllMyWarnings(userId: string): Promise<Report[]> {
    return await this.prisma.report.findMany({
      include: {
        reporter: true,
        decision: { include: { admin: true } },
      },
      where: {
        OR: [
          {
            targetType: 'USER',
            targetUser: { id: userId },
          },
          {
            targetType: 'BLOG',
            targetBlog: { userId },
          },
          {
            targetType: 'PROJECT',
            targetProject: { userId },
          },
        ],
      },
    })
  }

  async createReport(
    input: CreateReportInput,
    userId: string,
  ): Promise<Report> {
    const targetData =
      input.targetType === 'USER'
        ? { targetUserId: input.targetId }
        : input.targetType === 'BLOG'
          ? { targetBlogId: input.targetId }
          : input.targetType === 'PROJECT'
            ? { targetProjectId: input.targetId }
            : {}

    return await this.prisma.report.create({
      data: {
        reporterId: userId,
        targetType: input.targetType,
        category: input.category,
        reason: input.reason,
        ...targetData,
      },
      include: {
        reporter: true,
        decision: { include: { admin: true } },
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
    const whereCondition =
      targetType === 'USER'
        ? { targetUserId: targetId }
        : targetType === 'BLOG'
          ? { targetBlogId: targetId }
          : targetType === 'PROJECT'
            ? { targetProjectId: targetId }
            : {}

    const report = await this.prisma.report.findFirst({
      where: {
        reporterId: userId,
        targetType,
        ...whereCondition,
      },
    })

    return !!report
  }
}
