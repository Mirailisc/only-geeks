import { gql } from '@apollo/client'
// import { gql } from "@apollo/client"
import type { Profile } from "./profile"

export interface Achievement {
    User: Profile
    contentType: string
    createdAt: string
    date: string
    description: string
    id: string
    issuer: string
    photos: string[]
    title: string
    updatedAt: string
}

//export const findMyAchievement = gql``

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
    }
  }
`

export const DELETE_ACHIEVEMENT_MUTATION = gql`
  mutation DeleteAchievement($deleteAchievementId: String!) {
    deleteAchievement(id: $deleteAchievementId)
  }
`
