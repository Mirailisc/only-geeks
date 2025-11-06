import { gql } from '@apollo/client'

export interface Preference {
  currentTheme: "LIGHT" | "DARK" | "SYSTEM"
  isPublicProfile: boolean
}

export interface Profile {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  bio: string
  picture: string
  location: string
  preference: Partial<Preference>
  organization: string
  isAdmin: boolean
}

export const GET_MY_PROFILE_QUERY = gql`
  query getMyProfile {
    getMyProfile {
      id
      firstName
      lastName
      email
      bio
      preference {
        currentTheme
        isPublicProfile
      }
      picture
      location
      username
      organization
      isAdmin
      createdAt
      updatedAt
    }
  }
`

export const GET_PROFILE_BY_USERNAME_QUERY = gql`
  query GetProfileByUsername($username: String!) {
    getProfileByUsername(username: $username) {
      id
      firstName
      lastName
      email
      bio
      picture
      location
      username
      organization
      isAdmin
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PROFILE_INFO_MUTATION = gql`
  mutation UpdateProfileInfo($input: UpdateUserInput!) {
    updateProfileInfo(input: $input) {
      id
      firstName
      lastName
      email
      bio
      picture
      username
      location
      organization
      isAdmin
      createdAt
      updatedAt
    }
  }
`

// Example input:
// {
//   "input": {
//     "currentTheme": "LIGHT",
//     "isPublicProfile": true
//   }
// }

export const UPDATE_PREFERENCE_MUTATION = gql`
  mutation UpdatePreference($input: PreferenceInput!) {
    updatePreference(input: $input) {
      currentTheme
      isPublicProfile
    }
  }
`
