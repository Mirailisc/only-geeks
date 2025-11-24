import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { ReportService } from './report.service'
import {
  Report,
  ReportsCountSummary,
  ReportStatus,
  TargetType,
} from './entities/report.entity'
import { CreateReportInput } from './dto/create-report.input'
import { UseGuards } from '@nestjs/common'
import {
  AdminAuthGuard,
  GqlAuthGuard,
} from 'src/auth/guards/graphql-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

@Resolver()
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @Query(() => [Report])
  @UseGuards(GqlAuthGuard)
  async getMyReports(@CurrentUser() user: any): Promise<Report[]> {
    return this.reportService.findAllMyReports(user.id)
  }

  @Query(() => [Report])
  @UseGuards(GqlAuthGuard)
  async getMyWarnings(@CurrentUser() user: any): Promise<Report[]> {
    return this.reportService.findAllMyWarnings(user.id)
  }

  @Mutation(() => Report)
  @UseGuards(GqlAuthGuard)
  async createReport(
    @Args('input') input: CreateReportInput,
    @CurrentUser() user: any,
  ): Promise<Report> {
    return this.reportService.createReport(input, user.id)
  }

  // getAllReports
  @Query(() => [Report])
  @UseGuards(AdminAuthGuard)
  async getAllReports(): Promise<Report[]> {
    return this.reportService.getAllReports()
  }

  // getAllReportsByStatus
  @Query(() => [Report])
  @UseGuards(AdminAuthGuard)
  async getAllReportsByStatus(
    @Args('status') status: ReportStatus,
  ): Promise<Report[]> {
    return this.reportService.getAllReportsByStatus(status)
  }

  @Query(() => [Report])
  @UseGuards(AdminAuthGuard)
  async getAllReportByTargetType(
    @Args('targetType') targetType: TargetType,
  ): Promise<Report[]> {
    return this.reportService.getAllReportByType(targetType)
  }

  // findReportById
  @Query(() => Report)
  @UseGuards(AdminAuthGuard)
  async findReportById(@Args('id') id: string): Promise<Report> {
    return this.reportService.findReportById(id)
  }

  // updateReportStatus
  @Mutation(() => Report)
  @UseGuards(AdminAuthGuard)
  async updateReportStatus(
    @Args('id') id: string,
    @Args('status') status: ReportStatus,
  ): Promise<Report> {
    return this.reportService.updateReportStatus(id, status)
  }

  // deleteReport
  @Mutation(() => Report)
  @UseGuards(AdminAuthGuard)
  async deleteReport(@Args('id') id: string): Promise<Report> {
    return this.reportService.deleteReport(id)
  }

  // countReportsByStatus
  @Query(() => ReportsCountSummary)
  @UseGuards(AdminAuthGuard)
  async countReportsByStatus(): Promise<ReportsCountSummary> {
    return this.reportService.countReportsByStatus()
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async hasReportedTarget(
    @Args('targetId') targetId: string,
    @Args('targetType') targetType: TargetType,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.reportService.amIReportThis(user.id, targetType, targetId)
  }

  //Get recent reports
  @Query(() => [Report])
  @UseGuards(AdminAuthGuard)
  async getRecentReports(@Args('limit') limit: number): Promise<Report[]> {
    return this.reportService.getRecentReports(limit)
  }
}
