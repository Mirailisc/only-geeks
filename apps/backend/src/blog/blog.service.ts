import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateBlogInput } from './dto/create-blog.input'
import { UserService } from 'src/user/user.service'
import { UpdateBlogInput } from './dto/update-blog.input'

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getBlogs() {
    return await this.prisma.blog.findMany({
      where: {
        isPublish: true,
      },
    })
  }

  async getMyBlogs(userId: string) {
    return await this.prisma.blog.findMany({
      where: { userId },
    })
  }

  async getBlogsByUsername(username: string) {
    const user = await this.userService.findUserByUsername(username)

    return await this.prisma.blog.findMany({
      where: { userId: user.id, isPublish: true },
    })
  }

  async getBlogBySlugAndUsername(slug: string, username: string) {
    const user = await this.userService.findUserByUsername(username)

    return await this.prisma.blog.findUnique({
      where: { userId_slug: { userId: user.id, slug } },
    })
  }

  async createBlog(userId: string, input: CreateBlogInput) {
    const slug = input.title.toLowerCase().replace(/\s+/g, '-')

    return await this.prisma.blog.create({
      data: {
        ...input,
        userId,
        slug,
      },
    })
  }

  async updateBlog(id: string, input: UpdateBlogInput) {
    return await this.prisma.blog.update({
      where: { id },
      data: input,
    })
  }
}
