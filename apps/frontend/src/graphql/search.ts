import { gql } from '@apollo/client'
import type { Blog } from './blog'
import type { Profile } from './profile'

export interface Search {
  blogs: Pick<Blog, 'id' | 'title' | 'slug' | 'createdAt' | 'updatedAt' | 'userId'>[]
  users: Pick<Profile, 'id' | 'username' | 'firstName' | 'lastName' | 'picture'>[]
}

// {
//   variables: {
//     input: {
//         input: 'string'
//     }
//   }
// }

export const SEARCH_QUERY = gql`
  query Search($input: SearchInput!) {
    search(input: $input) {
      blogs {
        id
        title
        userId
        createdAt
        updatedAt
        slug
      }
      users {
        id
        username
        firstName
        lastName
        picture
      }
    }
  }
`

// {
//   variables: {
//     input: {
//         input: 'string'
//     }
//   }
// }

export const SEARCH_SUGGEST_QUERY = gql`
  query SearchSuggest($input: SearchInput!) {
    searchSuggest(input: $input) {
      blogs {
        id
        title
        userId
        createdAt
        updatedAt
        slug
      }
      users {
        id
        username
        firstName
        lastName
        picture
      }
    }
  }
`
