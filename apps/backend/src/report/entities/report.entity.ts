import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { User } from 'src/user/entities/user.entity'
import { UserReport, BlogReport, ProjectReport } from './report-special.entity'
import { ModerationDecision } from 'src/admin/entities/moderation.entity'

// ------------------ ENUMS ------------------

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  REQUEST_EDIT = 'REQUEST_EDIT',
  ALL = 'ALL',
}

export enum TargetType {
  USER = 'USER',
  BLOG = 'BLOG',
  PROJECT = 'PROJECT',
}

export enum ModerationAction {
  NONE = 'NONE',
  REQUEST_EDIT = 'REQUEST_EDIT',
  UNPUBLISH = 'UNPUBLISH',
  DEACTIVATE = 'DEACTIVATE',
  DELETE = 'DELETE',
  RESOLVED = 'RESOLVED',
}

export enum ReportCategory {
  PLAGIARISM = 'PLAGIARISM',
  VIOLENT_CONTENT = 'VIOLENT_CONTENT',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  MALWARE = 'MALWARE',
  INTELLECTUAL_PROPERTY_VIOLATION = 'INTELLECTUAL_PROPERTY_VIOLATION',
  MISINFORMATION = 'MISINFORMATION',
  UNSAFE_FEATURES = 'UNSAFE_FEATURES',
  DATA_MISUSE = 'DATA_MISUSE',
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  IMPERSONATION = 'IMPERSONATION',
  INAPPROPRIATE_BEHAVIOR = 'INAPPROPRIATE_BEHAVIOR',
  SCAM = 'SCAM',
  HATE_SPEECH = 'HATE_SPEECH',
  PRIVACY_VIOLATION = 'PRIVACY_VIOLATION',
  SEXUAL_HARASSMENT = 'SEXUAL_HARASSMENT',
  THREATS = 'THREATS',
  OTHER = 'OTHER',
}

// Register enums to GraphQL schema
registerEnumType(ReportStatus, { name: 'ReportStatus' })
registerEnumType(TargetType, { name: 'TargetType' })
registerEnumType(ModerationAction, { name: 'ModerationAction' })
registerEnumType(ReportCategory, { name: 'ReportCategory' })

// ------------------ OBJECT TYPES ------------------

@ObjectType()
export class ReportSummary {
  @Field(() => Number)
  status: number

  @Field(() => Number)
  pendingReports: number

  @Field(() => Number)
  underReviewReports: number

  @Field(() => Number)
  resolvedReports: number

  @Field(() => Number)
  rejectedReports: number
}

@ObjectType()
export class ReportsCountSummary {
  @Field(() => Number)
  PENDING: number

  @Field(() => Number)
  UNDER_REVIEW: number

  @Field(() => Number)
  RESOLVED: number

  @Field(() => Number)
  REJECTED: number

  @Field(() => Number)
  REQUEST_EDIT: number

  @Field(() => Number)
  ALL: number
}

@ObjectType()
export class Report {
  @Field(() => String)
  id: string

  @Field(() => String)
  reporterId: string

  @Field(() => ReportCategory)
  category: ReportCategory

  @Field(() => String)
  reason: string

  @Field(() => ReportStatus)
  status: ReportStatus

  @Field(() => String, { nullable: true })
  adminNote?: string

  @Field(() => TargetType)
  targetType: TargetType

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => User, { nullable: true })
  reporter: User

  @Field(() => ModerationDecision, { nullable: true })
  decision?: ModerationDecision

  @Field(() => UserReport, { nullable: true })
  userReport?: UserReport

  @Field(() => BlogReport, { nullable: true })
  blogReport?: BlogReport

  @Field(() => ProjectReport, { nullable: true })
  projectReport?: ProjectReport
}
