import { gql } from '@apollo/client'

export const ME_QUERY = gql`
  query Me {
    me {
      email
      firstName
      lastName
      isAdmin
    }
  }
`

export const GET_GOOGLE_OAUTH_URL = gql`
  query GetGoogleOauthUrl {
    getGoogleOauthUrl
  }
`

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`
