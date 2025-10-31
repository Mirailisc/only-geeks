import { gql } from "@apollo/client";
import type { Blog } from "./blog";
import type { Profile } from "./profile";
import type { Project } from "./project";
import type { Achievement } from "./achievement";

export interface FeedItem{
  items: Array<Partial<Blog> & { User: Partial<Profile> } | Partial<Project> & { User: Partial<Profile> } | Partial<Achievement> & { User: Partial<Profile> }>;
  nextCursor?: string
}

// Example input variable:
// {
//   "input": {
//     "limit": 10,
//     "type": "ALL"
//   }
// }

export const FEED_QUERY = gql`
  query Feed($input: FeedInput!) {
    feed(input: $input) {
      items {
        ... on BlogFeed {
          id
          title
          description
          thumbnail
          slug
          User {
            email
            firstName
            id
            picture
            username
            lastName
          }
          createdAt
          updatedAt
          contentType
        }
        ... on ProjectFeed {
          id
          title
          photos
          startDate
          endDate
          link
          description
          User {
            email
            firstName
            id
            picture
            username
            lastName
          }
          contentType
        }
        ... on AchievementFeed {
          id
          title
          photos
          description
          date
          issuer
          User {
            email
            firstName
            id
            picture
            username
            lastName
          }
          createdAt
          updatedAt
          contentType
        }
      }
      nextCursor
    }
  }
`