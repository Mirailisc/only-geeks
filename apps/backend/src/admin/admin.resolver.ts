import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { AdminGqlAuthGuard } from 'src/auth/guards/graphql-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { AdminService } from './admin.service'
import { UserRestriction, RestrictionType } from './entities/restriction.entity'
import { AdminAuditLog } from './entities/audit-log.entity'
import { CreateModerationDecisionInput } from './dto/create-moderation-decision.input'
import { CreateUserRestrictionInput } from './dto/create-user-restriction.input'
import { User } from 'src/user/entities/user.entity'
import { ModerationDecision } from './entities/moderation.entity'
import { ModerationAction } from 'src/report/entities/report.entity'

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  // ==================== MODERATION DECISIONS ====================

  @Mutation(() => ModerationDecision)
  @UseGuards(AdminGqlAuthGuard)
  async createModerationDecision(
    @Args('input') input: CreateModerationDecisionInput,
    @CurrentUser() admin: any,
  ): Promise<ModerationDecision> {
    return this.adminService.createModerationDecision(input, admin.id)
  }

  @Query(() => [ModerationDecision])
  @UseGuards(AdminGqlAuthGuard)
  async getAllModerationDecisions(): Promise<ModerationDecision[]> {
    return this.adminService.getAllModerationDecisions()
  }

  @Query(() => ModerationDecision)
  @UseGuards(AdminGqlAuthGuard)
  async getModerationDecisionByReportId(
    @Args('reportId') reportId: string,
  ): Promise<ModerationDecision> {
    return this.adminService.getModerationDecisionByReportId(reportId)
  }

  @Mutation(() => ModerationDecision)
  @UseGuards(AdminGqlAuthGuard)
  async updateModerationDecision(
    @Args('id') id: string,
    @Args('action') action: ModerationAction,
    @Args('note', { nullable: true }) note: string,
    @CurrentUser() admin: any,
  ): Promise<ModerationDecision> {
    return this.adminService.updateModerationDecision(
      id,
      action,
      note,
      admin.id,
    )
  }

  @Mutation(() => ModerationDecision)
  @UseGuards(AdminGqlAuthGuard)
  async deleteModerationDecision(
    @Args('id') id: string,
    @CurrentUser() admin: any,
  ): Promise<ModerationDecision> {
    return this.adminService.deleteModerationDecision(id, admin.id)
  }

  // ==================== USER RESTRICTIONS ====================

  @Mutation(() => UserRestriction)
  @UseGuards(AdminGqlAuthGuard)
  async createUserRestriction(
    @Args('input') input: CreateUserRestrictionInput,
    @CurrentUser() admin: any,
  ): Promise<UserRestriction> {
    return this.adminService.createUserRestriction(input, admin.id)
  }

  @Query(() => [UserRestriction])
  @UseGuards(AdminGqlAuthGuard)
  async getAllUserRestrictions(): Promise<UserRestriction[]> {
    return this.adminService.getAllUserRestrictions()
  }

  @Query(() => [UserRestriction])
  @UseGuards(AdminGqlAuthGuard)
  async getUserRestrictionsByUserId(
    @Args('userId') userId: string,
  ): Promise<UserRestriction[]> {
    return this.adminService.getUserRestrictionsByUserId(userId)
  }

  @Query(() => [UserRestriction])
  @UseGuards(AdminGqlAuthGuard)
  async getActiveUserRestrictions(
    @Args('userId') userId: string,
  ): Promise<UserRestriction[]> {
    return this.adminService.getActiveUserRestrictions(userId)
  }

  @Mutation(() => UserRestriction)
  @UseGuards(AdminGqlAuthGuard)
  async removeUserRestriction(
    @Args('id') id: string,
    @CurrentUser() admin: any,
  ): Promise<UserRestriction> {
    return this.adminService.removeUserRestriction(id, admin.id)
  }

  @Mutation(() => UserRestriction)
  @UseGuards(AdminGqlAuthGuard)
  async updateUserRestriction(
    @Args('id') id: string,
    @Args('type', { nullable: true }) type: RestrictionType,
    @Args('reason', { nullable: true }) reason: string,
    @Args('expiresAt', { nullable: true }) expiresAt: Date,
    @CurrentUser() admin: any,
  ): Promise<UserRestriction> {
    return this.adminService.updateUserRestriction(
      id,
      type,
      reason,
      expiresAt,
      admin.id,
    )
  }

  // ==================== USER MANAGEMENT ====================

  @Mutation(() => User)
  @UseGuards(AdminGqlAuthGuard)
  async deactivateUser(
    @Args('userId') userId: string,
    @Args('reason') reason: string,
    @CurrentUser() admin: any,
  ): Promise<User> {
    return this.adminService.deactivateUser(userId, reason, admin.id)
  }

  @Mutation(() => User)
  @UseGuards(AdminGqlAuthGuard)
  async activateUser(
    @Args('userId') userId: string,
    @CurrentUser() admin: any,
  ): Promise<User> {
    return this.adminService.activateUser(userId, admin.id)
  }

  @Query(() => [User])
  @UseGuards(AdminGqlAuthGuard)
  async getAllDeactivatedUsers(): Promise<User[]> {
    return this.adminService.getAllDeactivatedUsers()
  }

  // ==================== AUDIT LOGS ====================

  @Query(() => [AdminAuditLog])
  @UseGuards(AdminGqlAuthGuard)
  async getAllAuditLogs(): Promise<AdminAuditLog[]> {
    return this.adminService.getAllAuditLogs()
  }

  @Query(() => [AdminAuditLog])
  @UseGuards(AdminGqlAuthGuard)
  async getAuditLogsByAdmin(
    @Args('adminId') adminId: string,
  ): Promise<AdminAuditLog[]> {
    return this.adminService.getAuditLogsByAdmin(adminId)
  }

  @Query(() => [AdminAuditLog])
  @UseGuards(AdminGqlAuthGuard)
  async getAuditLogsByTarget(
    @Args('targetType') targetType: string,
    @Args('targetId') targetId: string,
  ): Promise<AdminAuditLog[]> {
    return this.adminService.getAuditLogsByTarget(targetType, targetId)
  }

  @Query(() => [AdminAuditLog])
  @UseGuards(AdminGqlAuthGuard)
  async getAuditLogsByActionType(
    @Args('actionType') actionType: string,
  ): Promise<AdminAuditLog[]> {
    return this.adminService.getAuditLogsByActionType(actionType)
  }

  @Query(() => [AdminAuditLog])
  @UseGuards(AdminGqlAuthGuard)
  async getRecentAuditLogs(
    @Args('limit', { defaultValue: 50 }) limit: number,
  ): Promise<AdminAuditLog[]> {
    return this.adminService.getRecentAuditLogs(limit)
  }
}
