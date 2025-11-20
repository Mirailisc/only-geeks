import { gql } from "@apollo/client";
import type { Blog } from "./blog";
import type { Profile } from "./profile";
import type { Project } from "./project";
import type { Achievement } from "./achievement";

export type FeedBlogType = Partial<Blog> & { User: Partial<Profile>, contentType: string };
export type FeedProjectType = Partial<Project> & { User: Partial<Profile>, contentType: string };
export type FeedAchievementType = Partial<Achievement> & { User: Partial<Profile>, contentType: string };
export type FeedItemType = FeedBlogType | FeedProjectType | FeedAchievementType;

export interface FeedResponse {
  items: FeedItemType[];
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
        User {
          email
          firstName
          id
          picture
          username
          lastName
        }
        description
        title
        thumbnail
        slug
        createdAt
        updatedAt
        contentType
        requestUnpublish
        requestEdit
        isResponse
      }
      ... on ProjectFeed {
        photos
        startDate
        title
        endDate
        link
        id
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
        requestEdit
        requestUnpublish
        isResponse
      }
      ... on AchievementFeed {
        updatedAt
        title
        photos
        description
        createdAt
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
        contentType
      }
    }
    nextCursor
  }
}
`

// Example input variable:
// {
//   "input": {
//     "since": "2025-11-03"
//   }
// }
export const FEED_NEW_COUNT_QUERY = gql`
  query Query($input: NewFeedCountInput!) {
    getNewFeedCount(input: $input)
  }
`