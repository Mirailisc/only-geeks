import { gql } from '@apollo/client'

export const ME_QUERY = gql`
  query Me {
    me {
      email
      username
      firstName
      lastName
      isAdmin
      preferences {
        currentTheme
        isPublicProfile
      }
      picture
    }
  }
`

export const GET_GOOGLE_OAUTH_URL = gql`
  query ExampleQuery($state: String!) {
    getGoogleOauthUrl(state: $state)
  }
`

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`

// {
//   "input": {
//     "username": "",
//     "password": ""
//   }
// }
export const LOGIN_MUTATION = gql`
  mutation Query($input: LoginInput!) {
    login(input: $input)
  }
`

// {
//   "input": {
//     "email": "",
//     "firstName": "",
//     "lastName": "",
//     "password": "",
//     "username": ""
//   }
// }
export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input)
  }
`
