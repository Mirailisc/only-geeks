import { gql } from "@apollo/client"
import type { Profile } from "./profile"
import type { ModerationAction, Report } from "./report"

export type RestrictionType = 'TEMP_BAN' | 'NO_POSTING' 

export interface UserRestriction {
  id: string
  userId: string
  type: RestrictionType
  reason?: string
  expiresAt?: Date
  createdAt: Date
  user?: Partial<Profile>
}

export interface ModerationDecision {
  id: string
  adminId: string
  reportId: string
  action: Partial<ModerationAction>
  note?: string
  createdAt: Date
  admin?: Partial<Profile>
  report?: Partial<Report>
}
export interface AdminAuditLog {
  id: string
  adminId: string
  actionType: string
  targetType: string
  targetId?: string
  details?: string
  createdAt: Date
  admin?: Partial<Profile>
}

// GraphQL Queries
// export const GET_ALL_REPORTS = gql`
//   query GetAllReports {
//     getAllReports {
//       id
//       reporterId
//       category
//       reason
//       status
//       adminNote
//       targetType
//       createdAt
//       updatedAt
//       reporter {
//         id
//         username
//         email
//       }
//       decision {
//         id
//         action
//         note
//         createdAt
//       }
//     }
//   }
// `;

// export const GET_ALL_REPORTS_BY_STATUS = gql`
// query GetAllReportsByStatus($status: String!) {
//   getAllReportsByStatus(status: $status) {
//     id
//     reporterId
//     category
//     reason
//     status
//     adminNote
//     targetType
//     createdAt
//     updatedAt
//     reporter {
//       id
//       username
//       email
//     }
//     decision {
//       id
//       action
//       note
//       createdAt
//     }
//   }
// }
// `
export const GET_REPORTS_BY_STATUS_OR_ALL = gql`
  query GetReportsByStatusOrAll($status: String!) {
    getAllReportsByStatus(status: $status) {
      id
      reporterId
      category
      reason
      status
      adminNote
      targetType
      createdAt
      updatedAt
      reporter {
        id
        username
        email
      }
      decision {
        id
        action
        note
        isResponse
        createdAt
        updatedAt
      }
      blogReport {
        target {
          id
          title
          slug
          User {
            firstName
            lastName
            picture
            username
            email
          }
          description
        }
      }
      projectReport {
        target {
          id
          photos
          title
          description
          User {
            lastName
            firstName
            picture
            username
            email
          }
        }
      }
      userReport {
        target {
          id
          username
          picture
          lastName
          firstName
          email
        }
      }
    }
  }
`;

export const GET_RECENT_REPORTS = gql`
query GetRecentReports($limit: Float!) {
  getRecentReports(limit: $limit) {
    id
    reporterId
    category
    reason
    status
    adminNote
    targetType
    createdAt
    updatedAt
    reporter {
      id
      username
      email
    }
    decision {
      id
      action
      note
      isResponse
      createdAt
      updatedAt
    }
    blogReport {
      target {
        id
        title
        slug
        User {
          firstName
          lastName
          picture
          username
          email
        }
        description
      }
    }
    projectReport {
      target {
        id
        photos
        title
        description
        User {
          lastName
          firstName
          picture
          username
          email
        }
      }
    }
    userReport {
      target {
        id
        username
        picture
        lastName
        firstName
        email
      }
    }
  }
}
`

export const GET_ALL_REPORTS_BY_TARGET_TYPE = gql`
query GetAllReportByTargetType($status: String!) {
  getAllReportByTargetType(status: $status) {
    id
    reporterId
    category
    reason
    status
    adminNote
    targetType
    createdAt
    updatedAt
    reporter {
      id
      username
      email
    }
    decision {
      id
      action
      note
      isResponse
      createdAt
    }
  }
}
`

export const GET_ALL_AUDIT_LOGS = gql`
  query GetAllAuditLogs {
    getAllAuditLogs {
      id
      adminId
      actionType
      targetType
      targetId
      details
      createdAt
      admin {
        id
        username
      }
    }
  }
`;

export const GET_ALL_USER_RESTRICTIONS = gql`
  query GetAllUserRestrictions {
    getAllUserRestrictions {
      id
      userId
      type
      reason
      expiresAt
      createdAt
      user {
        id
        username
        email
      }
    }
  }
`;

export const GET_ALL_DEACTIVATED_USERS = gql`
  query GetAllDeactivatedUsers {
    getAllDeactivatedUsers {
      id
      username
      firstName
      lastName
      email
      createdAt
    }
  }
`;

// GraphQL Mutations
export const CREATE_MODERATION_DECISION = gql`
  mutation CreateModerationDecision($input: CreateModerationDecisionInput!) {
    createModerationDecision(input: $input) {
      id
      action
      note
    }
  }
`;
export const UPDATE_MODERATION_DECISION = gql`
mutation UpdateModerationDecision($updateModerationDecisionId: String!, $action: String!, $note: String) {
  updateModerationDecision(id: $updateModerationDecisionId, action: $action, note: $note) {
    id
    action
    note
  }
}
`;

export const MARK_MODERATION_DECISION_AS_NOT_RESPONDED = gql`
  mutation MarkModerationDecisionAsUnresponded($id: String!) {
    markModerationDecisionAsUnresponded(id: $id) {
      id
    }
  }
`;
export const MARK_MODERATION_DECISION_AS_RESPONSE = gql`
  mutation MarkModerationDecisionAsResponse($id: String!) {
    markModerationDecisionAsResponse(id: $id) {
      id
    }
  }
`;

export const UPDATE_REPORT_STATUS = gql`
  mutation UpdateReportStatus($id: String!, $status: String!) {
    updateReportStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const CREATE_USER_RESTRICTION = gql`
  mutation CreateUserRestriction($input: CreateUserRestrictionInput!) {
    createUserRestriction(input: $input) {
      id
      type
      reason
    }
  }
`;

export const DEACTIVATE_USER = gql`
  mutation DeactivateUser($userId: String!, $reason: String!) {
    deactivateUser(userId: $userId, reason: $reason) {
      id
      username
    }
  }
`;

export const ACTIVATE_USER = gql`
  mutation ActivateUser($userId: String!) {
    activateUser(userId: $userId) {
      id
      username
    }
  }
`;

export const REMOVE_USER_RESTRICTION = gql`
  mutation RemoveUserRestriction($id: String!) {
    removeUserRestriction(id: $id) {
      id
    }
  }
`;

export const GET_REPORT_COUNTS_BY_STATUS = gql`
query CountReportsByStatus {
  countReportsByStatus {
    ALL
    PENDING
    REJECTED
    REQUEST_EDIT
    RESOLVED
    UNDER_REVIEW
  }
}
`

export const SEARCH_USER_QUERY = gql`
  query SearchUser($query: String!) {
    searchUser(query: $query) {
      id
      picture
      email
      lastName
      username
      firstName
    }
  }
`;