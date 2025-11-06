import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { UseGuards } from '@nestjs/common'
import {
  GqlAuthGuard,
  OptionalGqlAuthGuard,
} from 'src/auth/guards/graphql-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { UpdateUserInput } from './dto/update-user.input'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async getMyProfile(@CurrentUser() user: any) {
    return await this.userService.findUserByEmail(user.email)
  }

  @Query(() => User)
  @UseGuards(OptionalGqlAuthGuard)
  async getProfileByUsername(
    @Args('username') username: string,
    @CurrentUser() user: any,
  ) {
    return await this.userService.getUserProfileByUsername(username, user.id)
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateProfileInfo(
    @CurrentUser() user: any,
    @Args('input') input: UpdateUserInput,
  ) {
    return await this.userService.updateUserInfo(user.id, input)
  }
}
