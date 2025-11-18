import { gql } from '@apollo/client'
// import { gql } from "@apollo/client"
import type { Profile } from "./profile"

export interface Project {
    User: Partial<Profile>
    contentType: string
    description: string
    endDate: string
    editRequested: boolean
    requestUnpublish: boolean
    id: string
    link: string
    photos: string[]
    startDate: string
    title: string
}

//export const findmyproject = gql``

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
      editRequested
      requestUnpublish
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
      editRequested
      requestUnpublish
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
      User {
        username
        lastName
        firstName
        email
        picture
      }
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
