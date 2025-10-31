// import { gql } from "@apollo/client"
import type { Profile } from "./profile"

export interface Project {
    User: Profile
    contentType: string
    description: string
    endDate: string
    id: string
    link: string
    photos: string[]
    startDate: string
    title: string
}

//export const findmyproject = gql``