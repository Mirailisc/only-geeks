import { createUnionType, Field, ObjectType } from '@nestjs/graphql'
import { Achievement as achievementEntity } from 'src/achievement/entities/achievement.entity'
import { Blog as blogEntity } from 'src/blog/entities/blog.entity'
import { Project as projectEntity } from 'src/project/entities/project.entity'

type contentType = 'blog' | 'project' | 'achievement'

@ObjectType()
class BlogFeed extends blogEntity {
  @Field()
  contentType: contentType = 'blog'
}

@ObjectType()
class ProjectFeed extends projectEntity {
  @Field()
  contentType: contentType = 'project'
}

@ObjectType()
class AchievementFeed extends achievementEntity {
  @Field()
  contentType: contentType = 'achievement'
}

const FeedItemUnion = createUnionType({
  name: 'FeedItem',
  types: () => [BlogFeed, ProjectFeed, AchievementFeed] as const,
  resolveType(value) {
    if ('slug' in value) return BlogFeed
    if ('link' in value) return ProjectFeed
    if ('issuer' in value) return AchievementFeed
    return null
  },
})

@ObjectType()
export class FeedResponse {
  @Field(() => [FeedItemUnion])
  items: Array<typeof FeedItemUnion>

  @Field(() => String, { nullable: true })
  nextCursor?: string
}
