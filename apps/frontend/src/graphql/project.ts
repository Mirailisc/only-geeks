import { gql } from '@apollo/client'

export interface Project {
  id: string
  title: string
  description: string | null
  link: string | null
  photos: string[] | null
  startDate: Date | null
  endDate: Date | null
}

export const GET_MY_PROJECTS_QUERY = gql`
  query GetMyProjects {
    getMyProjects {
      id
      title
      description
      link
      photos
      startDate
      endDate
    }
  }
`

export const GET_MY_PROJECTS_QUERY_EDITING = gql`
  query GetMyProjects {
    getMyProjects {
      id
      title
      description
      link
      photos
      startDate
      endDate
    }
  }
`

export const GET_PROJECTS_BY_USERNAME_QUERY = gql`
  query Query($username: String!) {
    getProjectsByUsername(username: $username) {
      id
      title
      description
      link
      photos
      startDate
      endDate
    }
  }
`

export const UPDATE_PROJECT_MUTATION = gql`
  mutation Mutation($updateProjectId: String!, $input: UpdateProjectInput!) {
    updateProject(id: $updateProjectId, input: $input) {
      id
      title
      description
      link
      photos
      startDate
      endDate
    }
  }
`

export const CREATE_PROJECT_MUTATION = gql`
  mutation Mutation($input: CreateProjectInput!) {
    addProject(input: $input) {
      id
      title
      description
      link
      photos
      startDate
      endDate
    }
  }
`
export const DELETE_PROJECT_MUTATION = gql`
  mutation Mutation($deleteProjectId: String!) {
    deleteProject(id: $deleteProjectId)
  }
`
