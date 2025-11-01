import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { EducationService } from './education.service'
import { Education } from './entities/education.entity'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/graphql-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CreateEducationInput } from './dto/create-education.input'
import { UpdateEducationInput } from './dto/update-education.input'

@Resolver(() => Education)
export class EducationResolver {
  constructor(private readonly educationService: EducationService) {}

  @Query(() => [Education])
  @UseGuards(GqlAuthGuard)
  async getMyEducations(@CurrentUser() user: any) {
    return await this.educationService.findAllByUser(user.id)
  }

  @Query(() => [Education])
  @UseGuards(GqlAuthGuard)
  async getEducationsByUsername(@Args('username') username: string) {
    return await this.educationService.findAllByUsername(username)
  }

  @Mutation(() => Education)
  @UseGuards(GqlAuthGuard)
  async addEducation(
    @CurrentUser() user: any,
    @Args('input') input: CreateEducationInput,
  ) {
    return await this.educationService.create(user.id, input)
  }

  @Mutation(() => Education)
  @UseGuards(GqlAuthGuard)
  async updateEducation(
    @Args('id') id: string,
    @Args('input') input: UpdateEducationInput,
  ) {
    return await this.educationService.update(id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteEducation(@Args('id') id: string) {
    return await this.educationService.remove(id)
  }
}
