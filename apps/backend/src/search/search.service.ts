import { Injectable } from '@nestjs/common'
import { SearchInput } from './dto/search.input'
import { Search } from './entities/search.entity'
import { PrismaService } from 'src/prisma/prisma.service'
import { gunzipSync } from 'zlib'

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search({ input }: SearchInput): Promise<Search> {
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { username: { contains: input } },
          { firstName: { contains: input } },
          { lastName: { contains: input } },
        ],
      },
    })
    const blogs = await this.prisma.blog.findMany({
      where: {
        title: { contains: input },
        isPublished: true,
        User: { isActive: true },
      },
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

    const decompressBlogContent = blogs.map((b) => {
      const compressedContent = b.content
      const decompressedContent = compressedContent
        ? gunzipSync(compressedContent).toString('utf8')
        : null
      return {
        ...b,
        content: decompressedContent,
      }
    })

    return {
      users,
      blogs: decompressBlogContent,
    }
  }

  async searchSuggest(input: SearchInput): Promise<Search> {
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { username: { contains: input.input } },
          { firstName: { contains: input.input } },
          { lastName: { contains: input.input } },
        ],
      },
      take: 3,
    })
    const blogs = await this.prisma.blog.findMany({
      where: {
        title: { contains: input.input },
        isPublished: true,
        User: { isActive: true },
      },
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
    const decompressBlogContent = blogs.map((b) => {
      const compressedContent = b.content
      const decompressedContent = compressedContent
        ? gunzipSync(compressedContent).toString('utf8')
        : null
      return {
        ...b,
        content: decompressedContent,
      }
    })
    return {
      users,
      blogs: decompressBlogContent,
    }
  }
}
