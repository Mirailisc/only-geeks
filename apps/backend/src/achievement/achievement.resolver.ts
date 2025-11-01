import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AchievementService } from './achievement.service'
import { Achievement } from './entities/achievement.entity'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/graphql-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CreateAchievementInput } from './dto/create-achievement.input'
import { UpdateAchievementInput } from './dto/update-achievement.input'

@Resolver(() => Achievement)
export class AchievementResolver {
  constructor(private readonly achievementService: AchievementService) {}

  @Query(() => [Achievement])
  @UseGuards(GqlAuthGuard)
  async getMyAchievements(@CurrentUser() user: any) {
    return await this.achievementService.findAllByUser(user.id)
  }

  @Query(() => [Achievement])
  @UseGuards(GqlAuthGuard)
  async getAchievementsByUsername(@Args('username') username: string) {
    return await this.achievementService.findAllByUsername(username)
  }

  @Mutation(() => Achievement)
  @UseGuards(GqlAuthGuard)
  async addAchievement(
    @CurrentUser() user: any,
    @Args('input') input: CreateAchievementInput,
  ) {
    return await this.achievementService.create(user.id, input)
  }

  @Mutation(() => Achievement)
  @UseGuards(GqlAuthGuard)
  async updateAchievement(
    @Args('id') id: string,
    @Args('input') input: UpdateAchievementInput,
  ) {
    return await this.achievementService.update(id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteAchievement(@Args('id') id: string) {
    return await this.achievementService.remove(id)
  }
}
