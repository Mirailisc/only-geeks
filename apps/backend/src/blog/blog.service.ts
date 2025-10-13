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
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }

  async getMyBlogs(userId: string) {
    return await this.prisma.blog.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }

  async getBlogById(id: string) {
    return await this.prisma.blog.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }

  async getBlogsByUsername(username: string) {
    const user = await this.userService.findUserByUsername(username)

    return await this.prisma.blog.findMany({
      where: { userId: user.id, isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }

  async getBlogBySlugAndUsername(slug: string, username: string) {
    const user = await this.userService.findUserByUsername(username)

    return await this.prisma.blog.findUnique({
      where: { userId_slug: { userId: user.id, slug } },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
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
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }

  async updateBlog(id: string, input: UpdateBlogInput) {
    const slug = input.title.toLowerCase().replace(/\s+/g, '-')

    return await this.prisma.blog.update({
      where: { id },
      data: { ...input, slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }

  async deleteBlog(id: string) {
    return await this.prisma.blog.delete({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        description: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })
  }
}
