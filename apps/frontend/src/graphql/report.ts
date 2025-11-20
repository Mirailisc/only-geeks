import { gql } from '@apollo/client'
import type { Profile } from './profile'
import type { Blog } from './blog'
import type { Project } from './project'

export interface ReportStructure {
  targetType: ReportTargetType
  targetId: string
  reason: string
  category: ReportCategory | null
}

export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'REQUEST_EDIT' | 'RESOLVED' | 'REJECTED' | 'ALL'
export interface ReportStatusSummary {
  ALL: number
  PENDING: number
  REJECTED: number
  RESOLVED: number
  UNDER_REVIEW: number
  REQUEST_EDIT: number
}

export const ReportStatusList: ReportStatus[] = [
  'ALL',
  'PENDING',
  'UNDER_REVIEW',
  'REQUEST_EDIT',
  'RESOLVED',
  'REJECTED',
]

export const REPORT_STATUS_TEXT: Record<ReportStatus, string> = {
  ALL: 'All',
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  REQUEST_EDIT: 'Request Edit',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
}

export type ReportTargetType = 'USER' | 'BLOG' | 'PROJECT'
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

export interface ModerationDecision {  
  id: string
  adminId: string
  reportId: string
  action: ModerationAction
  isResponse: boolean
  note?: string
  createdAt: Date
  updatedAt: Date
  admin?: Partial<Profile>
}

export interface ReportSummary {
  status: number
  pendingReports: number
  underReviewReports: number
  resolvedReports: number
  rejectedReports: number
}

export interface ReportsCount {
  status: ReportStatus
  count: number
}

export interface UserReport {
  id: string
  reportId: string
  targetId: string
  target: Partial<Profile>
}
export interface ProjectReport {
  id: string
  reportId: string
  targetId: string
  target: Partial<Project>
}
export interface BlogReport {
  id: string
  reportId: string
  targetId: string
  target: Partial<Blog>
}

export interface Report {
  id: string
  reporterId: string
  category: ReportCategory
  reason: string
  status: ReportStatus
  adminNote?: string
  targetType: ReportTargetType
  createdAt: Date
  updatedAt: Date
  reporter: Partial<Profile>
  decision?: ModerationDecision
  userReport?: UserReport
  blogReport?: BlogReport
  projectReport?: ProjectReport
}

// Example variables:
// {
//   "input": {
//     "targetType": null,
//     "targetId": null,
//     "reason": null
//   }
// }
export const CREATE_REPORT_MUTATION = gql`
mutation CreateReport($input: CreateReportInput!) {
  createReport(input: $input) {
    id
    reporterId
    category
    reason
    status
    adminNote
    createdAt
    updatedAt
  }
}
`

export const AM_I_REPORT_THIS_QUERY = gql`
  query Query($targetId: String!, $targetType: String!) {
    hasReportedTarget(targetId: $targetId, targetType: $targetType)
  }
`