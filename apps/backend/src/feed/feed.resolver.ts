import { Args, Query, Resolver } from '@nestjs/graphql'
import { FeedService } from './feed.service'
import { FeedInput } from './dto/feed.input'
import { FeedResponse } from './entities/feed.entity'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/graphql-auth.guard'
import { NewFeedCountInput } from './dto/newfeed.input'

@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @Query(() => FeedResponse)
  @UseGuards(GqlAuthGuard)
  async feed(@Args('input') input: FeedInput): Promise<FeedResponse> {
    return this.feedService.search(input)
  }
  @Query(() => Number)
  @UseGuards(GqlAuthGuard)
  async getNewFeedCount(
    @Args('input') input: NewFeedCountInput,
  ): Promise<number> {
    return this.feedService.getCountNewItems(new Date(input.since))
  }
}
