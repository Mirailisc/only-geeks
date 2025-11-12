import { ObjectType, Field } from '@nestjs/graphql'
import { User } from 'src/user/entities/user.entity'
import { UserReport } from './report-special.entity'
import { BlogReport } from './report-special.entity'
import { ProjectReport } from './report-special.entity'

export type ReportStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'RESOLVED'
  | 'REJECTED'
  | 'ALL'
export type TargetType = 'USER' | 'BLOG' | 'PROJECT'
export type ModerationAction =
  | 'NONE'
  | 'REQUEST_EDIT'
  | 'UNPUBLISH'
  | 'DEACTIVATE'
  | 'DELETE'
export type ReportCategory =
  | 'PLAGIARISM'
  | 'VIOLENT_CONTENT'
  | 'INAPPROPRIATE_CONTENT'
  | 'MALWARE'
  | 'INTELLECTUAL_PROPERTY_VIOLATION'
  | 'MISINFORMATION'
  | 'UNSAFE_FEATURES'
  | 'DATA_MISUSE'
  | 'SPAM'
  | 'HARASSMENT'
  | 'IMPERSONATION'
  | 'INAPPROPRIATE_BEHAVIOR'
  | 'SCAM'
  | 'HATE_SPEECH'
  | 'PRIVACY_VIOLATION'
  | 'SEXUAL_HARASSMENT'
  | 'THREATS'
  | 'OTHER'

@ObjectType()
export class ModerationDecision {
  @Field(() => String)
  id: string

  @Field(() => String)
  adminId: string

  @Field(() => String)
  reportId: string

  @Field(() => String)
  action: ModerationAction

  @Field(() => String, { nullable: true })
  note?: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => User, { nullable: true })
  admin?: User
}

@ObjectType()
export class ReportSummary {
  @Field(() => String)
  status: number

  @Field(() => String)
  pendingReports: number

  @Field(() => String)
  underReviewReports: number

  @Field(() => String)
  resolvedReports: number

  @Field(() => String)
  rejectedReports: number
}

@ObjectType()
export class ReportsCount {
  @Field(() => String)
  status: ReportStatus

  @Field(() => Number)
  count: number
}

@ObjectType()
export class Report {
  @Field(() => String)
  id: string

  @Field(() => String)
  reporterId: string

  @Field(() => String)
  category: ReportCategory

  @Field(() => String)
  reason: string

  @Field(() => String)
  status: ReportStatus

  @Field(() => String)
  adminNote: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => User, { nullable: true })
  reporter: User

  @Field(() => ModerationDecision, { nullable: true })
  decision: ModerationDecision

  @Field(() => UserReport, { nullable: true })
  userReport?: UserReport

  @Field(() => BlogReport, { nullable: true })
  blogReport?: BlogReport

  @Field(() => ProjectReport, { nullable: true })
  projectReport?: ProjectReport
}

@ObjectType()
export class ReportPagination {
  @Field(() => [Report])
  reports: Report[]

  @Field(() => Number)
  totalCount: number

  @Field(() => Number)
  page: number

  @Field(() => Number)
  pageSize: number
}
