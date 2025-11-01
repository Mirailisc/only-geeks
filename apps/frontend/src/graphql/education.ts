import { gql } from '@apollo/client'

export interface Education {
  id: string
  school: string
  degree: string
  fieldOfStudy?: string
  startDate?: string
  endDate?: string
}

export const GET_MY_EDUCATION_QUERY = gql`
  query GetMyEducations {
    getMyEducations {
      id
      school
      degree
      fieldOfStudy
      startDate
      endDate
    }
  }
`

export const GET_MY_EDUCATION_QUERY_EDITING = gql`
  query GetMyEducations {
    getMyEducations {
      id
      school
      degree
      fieldOfStudy
      startDate
      endDate
    }
  }
`

export const GET_EDUCATION_BY_USERNAME_QUERY = gql`
  query GetEducationsByUsername($username: String!) {
    getEducationsByUsername(username: $username) {
      id
      school
      degree
      fieldOfStudy
      startDate
      endDate
    }
  }
`

export const CREATE_EDUCATION_MUTATION = gql`
  mutation AddEducation($input: CreateEducationInput!) {
    addEducation(input: $input) {
      id
      school
      degree
      fieldOfStudy
      startDate
      endDate
    }
  }
`

export const UPDATE_EDUCATION_MUTATION = gql`
  mutation UpdateEducation($updateEducationId: String!, $input: UpdateEducationInput!) {
    updateEducation(id: $updateEducationId, input: $input) {
      id
      school
      degree
      fieldOfStudy
      startDate
      endDate
    }
  }
`

export const DELETE_EDUCATION_MUTATION = gql`
  mutation DeleteEducation($deleteEducationId: String!) {
    deleteEducation(id: $deleteEducationId)
  }
`
