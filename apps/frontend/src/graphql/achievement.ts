import { gql } from '@apollo/client'

export interface Achievement {
  id: string
  title: string
  description?: string
  issuer?: string | null
  date?: Date | null
  photos?: string[] | null
  createdAt: Date
  updatedAt: Date
}

export const GET_MY_ACHIEVEMENTS_QUERY = gql`
  query GetMyAchievements {
    getMyAchievements {
      id
      title
      description
      issuer
      date
      photos
      createdAt
      updatedAt
    }
  }
`

export const GET_MY_ACHIEVEMENTS_QUERY_EDITING = gql`
  query GetMyAchievements {
    getMyAchievements {
      id
      title
      description
      issuer
      date
      photos
      createdAt
      updatedAt
    }
  }
`

export const GET_ACHIEVEMENTS_BY_USERNAME_QUERY = gql`
  query GetAchievementsByUsername($username: String!) {
    getAchievementsByUsername(username: $username) {
      id
      title
      description
      issuer
      date
      photos
      createdAt
      updatedAt
    }
  }
`

export const CREATE_ACHIEVEMENT_MUTATION = gql`
  mutation AddAchievement($input: CreateAchievementInput!) {
    addAchievement(input: $input) {
      id
      title
      description
      issuer
      date
      photos
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_ACHIEVEMENT_MUTATION = gql`
  mutation UpdateAchievement($updateAchievementId: String!, $input: UpdateAchievementInput!) {
    updateAchievement(id: $updateAchievementId, input: $input) {
      id
      title
      description
      issuer
      date
      photos
      createdAt
      updatedAt
      createdAt
      updatedAt
    }
  }
`

export const DELETE_ACHIEVEMENT_MUTATION = gql`
  mutation DeleteAchievement($deleteAchievementId: String!) {
    deleteAchievement(id: $deleteAchievementId)
  }
`
