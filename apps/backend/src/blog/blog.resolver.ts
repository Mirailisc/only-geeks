import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { BlogService } from './blog.service'
import { Blog } from './entities/blog.entity'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { UseGuards } from '@nestjs/common'
import {
  GqlAuthGuard,
  OptionalGqlAuthGuard,
} from 'src/auth/guards/graphql-auth.guard'
import { CreateBlogInput } from './dto/create-blog.input'
import { UpdateBlogInput } from './dto/update-blog.input'

@Resolver()
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}

  @Query(() => [Blog])
  async getBlogs() {
    return await this.blogService.getBlogs()
  }

  @Query(() => Blog)
  @UseGuards(OptionalGqlAuthGuard)
  async getBlogBySlugAndUsername(
    @Args('slug') slug: string,
    @Args('username') username: string,
    @CurrentUser() user: any,
  ) {
    return await this.blogService.getBlogBySlugAndUsername(
      slug,
      username,
      user.id,
    )
  }

  @Query(() => [Blog])
  async getBlogsByUsername(@Args('username') username: string) {
    return await this.blogService.getBlogsByUsername(username)
  }

  @Query(() => [Blog])
  @UseGuards(GqlAuthGuard)
  async getMyBlogs(@CurrentUser() user: any) {
    return await this.blogService.getMyBlogs(user.id)
  }

  @Query(() => Blog)
  async getBlogById(@Args('id') id: string) {
    return await this.blogService.getBlogById(id)
  }

  @Mutation(() => Blog)
  @UseGuards(GqlAuthGuard)
  async createBlog(
    @CurrentUser() user: any,
    @Args('input') input: CreateBlogInput,
  ) {
    return await this.blogService.createBlog(user.id, input)
  }

  @Mutation(() => Blog)
  @UseGuards(GqlAuthGuard)
  async updateBlog(
    @Args('id') id: string,
    @Args('input') input: UpdateBlogInput,
  ) {
    return await this.blogService.updateBlog(id, input)
  }

  @Mutation(() => Blog)
  @UseGuards(GqlAuthGuard)
  async deleteBlog(@Args('id') id: string) {
    return await this.blogService.deleteBlog(id)
  }
}
