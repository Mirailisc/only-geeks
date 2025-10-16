import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ProjectService } from './project.service'
import { Project } from './entities/project.entity'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/graphql-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CreateProjectInput } from './dto/create-project.input'
import { UpdateProjectInput } from './dto/update-project.input'

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [Project])
  @UseGuards(GqlAuthGuard)
  async getMyProjects(@CurrentUser() user: any) {
    return await this.projectService.findAllByUser(user.id)
  }

  @Mutation(() => Project)
  @UseGuards(GqlAuthGuard)
  async addProject(
    @CurrentUser() user: any,
    @Args('input') input: CreateProjectInput,
  ) {
    return await this.projectService.create(user.id, input)
  }

  @Mutation(() => Project)
  @UseGuards(GqlAuthGuard)
  async updateProject(
    @Args('id') id: string,
    @Args('input') input: UpdateProjectInput,
  ) {
    return await this.projectService.update(id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteProject(@Args('id') id: string) {
    return await this.projectService.remove(id)
  }
}
