import { Args, Query, Resolver } from '@nestjs/graphql'
import { FeedService } from './feed.service'
import { FeedInput } from './dto/feed.input'
import { FeedResponse } from './entities/feed.entity'
import { UseGuards } from '@nestjs/common'
import { GuestAuthGuard } from 'src/auth/guards/graphql-auth.guard'
import { NewFeedCountInput } from './dto/newfeed.input'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @Query(() => FeedResponse)
  @UseGuards(GuestAuthGuard)
  async feed(
    @Args('input') input: FeedInput,
    @CurrentUser() user: any,
  ): Promise<FeedResponse> {
    return this.feedService.search(input, user?.id)
  }
  @Query(() => Number)
  @UseGuards(GuestAuthGuard)
  async getNewFeedCount(
    @Args('input') input: NewFeedCountInput,
    @CurrentUser() user: any,
  ): Promise<number> {
    return this.feedService.getCountNewItems(new Date(input.since), user?.id)
  }
}
