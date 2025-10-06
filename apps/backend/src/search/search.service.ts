import { Injectable } from '@nestjs/common'
import { SearchInput } from './dto/search.input'
import { Search } from './entities/search.entity'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search({ input }: SearchInput): Promise<Search> {
    const users = await this.prisma.user.findMany({
      where: { username: { contains: input } },
    })
    const blogs = await this.prisma.blog.findMany({
      where: { title: { contains: input }, isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        description: true,
        thumbnail: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
    })

    return {
      users,
      blogs,
    }
  }

  async searchSuggest(input: SearchInput): Promise<Search> {
    const users = await this.prisma.user.findMany({
      where: { username: { contains: input.input } },
      take: 3,
    })
    const blogs = await this.prisma.blog.findMany({
      where: { title: { contains: input.input }, isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        description: true,
        thumbnail: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
      take: 3,
    })

    return {
      users,
      blogs,
    }
  }
}
