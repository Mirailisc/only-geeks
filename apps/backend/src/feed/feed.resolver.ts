import { Args, Query, Resolver } from '@nestjs/graphql'
import { FeedService } from './feed.service'
import { FeedInput } from './dto/feed.input'
import { FeedResponse } from './entities/feed.entity'

@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @Query(() => FeedResponse)
  async feed(@Args('input') input: FeedInput): Promise<FeedResponse> {
    return this.feedService.search(input)
  }
}
