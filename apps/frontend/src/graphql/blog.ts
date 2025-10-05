import { gql } from '@apollo/client'

export interface Blog {
  id: string
  userId: string
  slug: string
  title: string
  thumbnail: string | null
  description: string | null
  content: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export const GET_BLOGS_QUERY = gql`
  query GetBlogs {
    getBlogs {
      id
      title
      content
      slug
      thumbnail
      description
      isPublished
      userId
      createdAt
      updatedAt
    }
  }
`

// Example Variable
// {
//   variable: {
//     username: 'your_mom',
//     slug: 'hello-world'
//   }
// }
// Expected path to be /blog/:username/:slug

export const GET_BLOG_BY_SLUG_AND_USERNAME_QUERY = gql`
  query GetBlogBySlugAndUsername($slug: String!, $username: String!) {
    getBlogBySlugAndUsername(slug: $slug, username: $username) {
      id
      title
      content
      slug
      thumbnail
      description
      isPublished
      userId
      createdAt
      updatedAt
    }
  }
`

// Example Variable
// {
//   variable: {
//     username: 'your_mom'
//   }
// }

export const GET_BLOGS_BY_USERNAME_QUERY = gql`
  query GetBlogsByUsername($username: String!) {
    getBlogsByUsername(username: $username) {
      id
      title
      content
      slug
      thumbnail
      description
      isPublished
      userId
      createdAt
      updatedAt
    }
  }
`

export const GET_MY_BLOGS_QUERY = gql`
  query GetMyBlogs {
    getMyBlogs {
      id
      title
      content
      slug
      thumbnail
      description
      isPublished
      userId
      createdAt
      updatedAt
    }
  }
`

// Example Variable
// {
//   variable: {
//     input: {
//       content: 'hello world',
//       title: 'hello world',
//       thumbnail: '',
//     },
//   },
// }

export const CREATE_BLOG_MUTATION = gql`
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(input: $input) {
      id
      title
      content
      slug
      thumbnail
      description
      isPublished
      userId
      createdAt
      updatedAt
    }
  }
`

// Example Variable
// {
//   variable: {
//     blogId: '123123',
//     input: {
//       content: 'hello world',
//       title: 'hello world',
//       thumbnail: '',
//     },
//   },
// }

export const UPDATE_BLOG_MUTATION = gql`
  mutation UpdateBlog($blogId: String!, $input: UpdateBlogInput!) {
    updateBlog(id: $blogId, input: $input) {
      id
      title
      content
      slug
      thumbnail
      description
      isPublished
      userId
      createdAt
      updatedAt
    }
  }
`
