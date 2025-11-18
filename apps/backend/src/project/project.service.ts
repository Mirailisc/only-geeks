import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProjectInput } from './dto/create-project.input'
import { UpdateProjectInput } from './dto/update-project.input'
import { UserService } from 'src/user/user.service'
import { Project } from './entities/project.entity'
import { AdminService } from 'src/admin/admin.service'

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  async create(userId: string, input: CreateProjectInput) {
    // verify that user exists and no restriction "NO_POSTING"
    const user = await this.userService.findUserById(userId)
    if (!user) throw new BadRequestException('User not found')

    const myRestriction = await Promise.all(
      await this.adminService.getActiveUserRestrictions(userId),
    )
    const now = new Date()
    const noPostRestrictions = myRestriction.find(
      (restriction) =>
        restriction.type === 'NO_POSTING' && restriction.expiresAt > now,
    )
    if (noPostRestrictions)
      throw new BadRequestException(
        'You are restricted from posting new projects.',
      )

    return await this.prisma.project.create({
      data: { ...input, userId },
      include: { User: true },
    })
  }

  async findAllByUser(userId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      include: {
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

    return projects.map((p) => {
      const decisions = p.reports
        .map((pr) => pr.report.decision?.action)
        .filter(Boolean)

      return {
        ...p,
        editRequested: decisions.includes('REQUEST_EDIT'),
        requestUnpublish: decisions.includes('UNPUBLISH'),
      }
    })
  }

  async findAllByUsername(username: string): Promise<Project[]> {
    const user = await this.userService.findUserByUsername(username)
    if (!user) throw new BadRequestException('User not found')
    const projects = await this.prisma.project.findMany({
      where: {
        userId: user.id,
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
      orderBy: { startDate: 'desc' },
      include: {
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
    return projects.map((p) => {
      return {
        ...p,
        editRequested: false,
        requestUnpublish: false,
      }
    })
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { User: true, reports: true },
    })
    if (!project) throw new BadRequestException('Project not found')
    return project
  }

  async update(id: string, input: UpdateProjectInput) {
    const existing = await this.findOne(id)

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
    // const reports = await this.adminService.getModerationDecisionByReportIds

    return await this.prisma.project.update({
      where: { id: existing.id },
      data: input,
      include: { User: true },
    })
  }

  async remove(id: string) {
    const existing = await this.findOne(id)
    await this.prisma.project.delete({
      where: { id: existing.id },
      include: { User: true },
    })
    return true
  }
}
