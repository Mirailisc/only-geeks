// import { gql } from "@apollo/client"
import type { Profile } from "./profile"

export interface Achievement {
    User: Profile
    contentType: string
    createdAt: string
    date: string
    description: string
    id: string
    issuer: string
    photos: string[]
    title: string
    updatedAt: string
}

//export const findMyAchievement = gql``