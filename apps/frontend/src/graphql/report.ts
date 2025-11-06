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

export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED'
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
  note?: string
  createdAt: Date
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

export interface Report {
  id: string
  reporterId: string
  targetType: ReportTargetType
  targetId: string
  targetUserId: string
  targetBlogId: string
  targetProjectId: string
  reason: string
  status: ReportStatus
  adminNote: string
  createdAt: Date
  updatedAt: Date
  category: ReportCategory
  reporter: Partial<Profile>
  targetUser?: Partial<Profile>
  targetBlog?: Partial<Blog>
  targetProject?: Partial<Project>
  decision: Partial<ModerationDecision>
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
    reason
    reporter {
      username
      lastName
      firstName
      email
      picture
    }
    status
    decision {
      action
      note
      admin {
        lastName
        firstName
        email
        picture
        username
      }
      createdAt
    }
    targetBlog {
      title
      thumbnail
      slug
      User {
        lastName
        firstName
        email
        picture
        username
      }
      description
      id
    }
    targetUserId
    targetBlogId
    targetProjectId
    targetProject {
      photos
      startDate
      title
      id
      link
      endDate
      description
      User {
        firstName
        lastName
        email
        username
        picture
      }
    }
    targetType
    targetUser {
      email
      firstName
      bio
      lastName
      location
      organization
      picture
      username
    }
  }
}
`

export const AM_I_REPORT_THIS_QUERY = gql`
  query Query($targetId: String!, $targetType: String!) {
    hasReportedTarget(targetId: $targetId, targetType: $targetType)
  }
`