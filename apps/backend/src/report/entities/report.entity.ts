import { ObjectType, Field } from '@nestjs/graphql'
import { Blog } from 'src/blog/entities/blog.entity'
import { Project } from 'src/project/entities/project.entity'
import { User } from 'src/user/entities/user.entity'

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
  targetType: TargetType
  @Field(() => String, { nullable: true })
  targetUserId?: string
  @Field(() => String, { nullable: true })
  targetBlogId?: string
  @Field(() => String, { nullable: true })
  targetProjectId?: string
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

  @Field(() => String)
  category: ReportCategory

  @Field(() => User, { nullable: true })
  reporter: User

  @Field(() => User, { nullable: true })
  targetUser?: User

  @Field(() => Blog, { nullable: true })
  targetBlog?: Blog

  @Field(() => Project, { nullable: true })
  targetProject?: Project

  @Field(() => ModerationDecision, { nullable: true })
  decision: ModerationDecision
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
