import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateModerationDecisionInput } from './dto/create-moderation-decision.input'
import { CreateUserRestrictionInput } from './dto/create-user-restriction.input'
import { ModerationDecision } from './entities/moderation.entity'
import {
  ModerationAction,
  ReportStatus,
} from 'src/report/entities/report.entity'
import { RestrictionType, UserRestriction } from './entities/restriction.entity'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== AUDIT LOGGING ====================

  private async createAuditLog(
    adminId: string,
    actionType: string,
    targetType: string,
    targetId?: string,
    details?: string,
  ) {
    return this.prisma.adminAuditLog.create({
      data: {
        adminId,
        actionType,
        targetType,
        targetId,
        details,
      },
    })
  }

  // ==================== MODERATION DECISIONS ====================

  async createModerationDecision(
    input: CreateModerationDecisionInput,
    adminId: string,
  ): Promise<ModerationDecision> {
    // Check if report exists
    const report = await this.prisma.report.findUnique({
      where: { id: input.reportId },
    })

    if (!report) {
      throw new NotFoundException('Report not found')
    }

    // Check if decision already exists for this report
    const existingDecision = await this.prisma.moderationDecision.findUnique({
      where: { reportId: input.reportId },
    })

    if (existingDecision) {
      throw new Error('Moderation decision already exists for this report')
    }

    // Create moderation decision
    const decision = await this.prisma.moderationDecision.create({
      data: {
        adminId,
        reportId: input.reportId,
        action: input.action,
        note: input.note,
      },
      include: {
        admin: true,
        report: {
          include: {
            reporter: true,
            userReport: { include: { target: true } },
            blogReport: { include: { target: true } },
            projectReport: { include: { target: true } },
          },
        },
      },
    })

    // Update report status to RESOLVED
    await this.prisma.report.update({
      where: { id: input.reportId },
      data: { status: ReportStatus.RESOLVED },
    })

    // Log the action
    await this.createAuditLog(
      adminId,
      'CREATE_MODERATION_DECISION',
      'REPORT',
      input.reportId,
      `Action: ${input.action}, Note: ${input.note || 'N/A'}`,
    )

    return decision as unknown as ModerationDecision
  }

  async getAllModerationDecisions(): Promise<ModerationDecision[]> {
    return this.prisma.moderationDecision.findMany({
      include: {
        admin: true,
        report: {
          include: {
            reporter: true,
            userReport: { include: { target: true } },
            blogReport: { include: { target: true } },
            projectReport: { include: { target: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }) as unknown as ModerationDecision[]
  }

  async getModerationDecisionByReportId(
    reportId: string,
  ): Promise<ModerationDecision> {
    const decision = await this.prisma.moderationDecision.findUnique({
      where: { reportId },
      include: {
        admin: true,
        report: {
          include: {
            reporter: true,
            userReport: { include: { target: true } },
            blogReport: { include: { target: true } },
            projectReport: { include: { target: true } },
          },
        },
      },
    })

    if (!decision) {
      throw new NotFoundException('Moderation decision not found')
    }

    return decision as unknown as ModerationDecision
  }

  async updateModerationDecision(
    id: string,
    action: ModerationAction,
    note: string,
    adminId: string,
  ): Promise<ModerationDecision> {
    const decision = await this.prisma.moderationDecision.findUnique({
      where: { id },
    })

    if (!decision) {
      throw new NotFoundException('Moderation decision not found')
    }

    const updated = await this.prisma.moderationDecision.update({
      where: { id },
      data: { action, note },
      include: {
        admin: true,
        report: {
          include: {
            reporter: true,
            userReport: { include: { target: true } },
            blogReport: { include: { target: true } },
            projectReport: { include: { target: true } },
          },
        },
      },
    })

    // Log the action
    await this.createAuditLog(
      adminId,
      'UPDATE_MODERATION_DECISION',
      'MODERATION_DECISION',
      id,
      `Action: ${action}, Note: ${note || 'N/A'}`,
    )

    return updated as unknown as ModerationDecision
  }

  async deleteModerationDecision(
    id: string,
    adminId: string,
  ): Promise<ModerationDecision> {
    const decision = await this.prisma.moderationDecision.findUnique({
      where: { id },
    })

    if (!decision) {
      throw new NotFoundException('Moderation decision not found')
    }

    const deleted = await this.prisma.moderationDecision.delete({
      where: { id },
      include: {
        admin: true,
        report: true,
      },
    })

    // Log the action
    await this.createAuditLog(
      adminId,
      'DELETE_MODERATION_DECISION',
      'MODERATION_DECISION',
      id,
      `Deleted decision for report: ${decision.reportId}`,
    )

    return deleted as unknown as ModerationDecision
  }

  // ==================== USER RESTRICTIONS ====================

  async createUserRestriction(
    input: CreateUserRestrictionInput,
    adminId: string,
  ): Promise<UserRestriction> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const restriction = await this.prisma.userRestriction.create({
      data: {
        userId: input.userId,
        type: input.type,
        reason: input.reason,
        expiresAt: input.expiresAt,
      },
      include: {
        user: true,
      },
    })

    // Log the action
    await this.createAuditLog(
      adminId,
      'CREATE_USER_RESTRICTION',
      'USER',
      input.userId,
      `Type: ${input.type}, Reason: ${input.reason || 'N/A'}, Expires: ${input.expiresAt || 'Never'}`,
    )

    return restriction as unknown as UserRestriction
  }

  async getAllUserRestrictions(): Promise<UserRestriction[]> {
    return this.prisma.userRestriction.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    }) as unknown as UserRestriction[]
  }

  async getUserRestrictionsByUserId(
    userId: string,
  ): Promise<UserRestriction[]> {
    return this.prisma.userRestriction.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    }) as unknown as UserRestriction[]
  }

  async getActiveUserRestrictions(userId: string): Promise<UserRestriction[]> {
    const now = new Date()
    return this.prisma.userRestriction.findMany({
      where: {
        userId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    }) as unknown as UserRestriction[]
  }

  async removeUserRestriction(
    id: string,
    adminId: string,
  ): Promise<UserRestriction> {
    const restriction = await this.prisma.userRestriction.findUnique({
      where: { id },
    })

    if (!restriction) {
      throw new NotFoundException('User restriction not found')
    }

    const deleted = await this.prisma.userRestriction.delete({
      where: { id },
      include: {
        user: true,
      },
    })

    // Log the action
    await this.createAuditLog(
      adminId,
      'REMOVE_USER_RESTRICTION',
      'USER',
      restriction.userId,
      `Removed restriction: ${restriction.type}`,
    )

    return deleted as unknown as UserRestriction
  }

  async updateUserRestriction(
    id: string,
    type?: RestrictionType,
    reason?: string,
    expiresAt?: Date,
    adminId?: string,
  ): Promise<UserRestriction> {
    const restriction = await this.prisma.userRestriction.findUnique({
      where: { id },
    })

    if (!restriction) {
      throw new NotFoundException('User restriction not found')
    }

    const updated = await this.prisma.userRestriction.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(reason !== undefined && { reason }),
        ...(expiresAt !== undefined && { expiresAt }),
      },
      include: {
        user: true,
      },
    })

    // Log the action
    if (adminId) {
      await this.createAuditLog(
        adminId,
        'UPDATE_USER_RESTRICTION',
        'USER',
        restriction.userId,
        `Updated restriction: ${type || restriction.type}`,
      )
    }

    return updated as unknown as UserRestriction
  }

  // ==================== USER MANAGEMENT ====================

  async deactivateUser(userId: string, reason: string, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.isActive) {
      throw new Error('User is already deactivated')
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        deactivatedReason: reason,
      },
    })

    // Log the action
    await this.createAuditLog(
      adminId,
      'DEACTIVATE_USER',
      'USER',
      userId,
      `Reason: ${reason}`,
    )

    return updated as unknown as User
  }

  async activateUser(userId: string, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.isActive) {
      throw new Error('User is already active')
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        deactivatedReason: null,
      },
    })

    // Log the action
    await this.createAuditLog(
      adminId,
      'ACTIVATE_USER',
      'USER',
      userId,
      'User account reactivated',
    )

    return updated
  }

  async getAllDeactivatedUsers() {
    return this.prisma.user.findMany({
      where: { isActive: false },
      orderBy: { updatedAt: 'desc' },
    })
  }

  // ==================== AUDIT LOGS ====================

  async getAllAuditLogs() {
    return this.prisma.adminAuditLog.findMany({
      include: {
        admin: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getAuditLogsByAdmin(adminId: string) {
    return this.prisma.adminAuditLog.findMany({
      where: { adminId },
      include: {
        admin: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getAuditLogsByTarget(targetType: string, targetId: string) {
    return this.prisma.adminAuditLog.findMany({
      where: {
        targetType,
        targetId,
      },
      include: {
        admin: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getAuditLogsByActionType(actionType: string) {
    return this.prisma.adminAuditLog.findMany({
      where: { actionType },
      include: {
        admin: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getRecentAuditLogs(limit: number) {
    return this.prisma.adminAuditLog.findMany({
      include: {
        admin: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }
}
