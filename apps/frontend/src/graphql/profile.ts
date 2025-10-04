import { gql } from '@apollo/client'

export const GET_MY_PROFILE_QUERY = gql`
  query getMyProfile {
    getMyProfile {
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
