import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUsername(firstName: string, lastName: string) {
    const baseUsername = firstName.toLowerCase() + lastName[0].toLowerCase()

    const users = await this.prisma.user.findMany({
      where: {
        username: {
          startsWith: baseUsername,
        },
      },
      select: {
        username: true,
      },
    })

    if (!users.some((u) => u.username === baseUsername)) {
      return baseUsername
    }

    const numbers = users
      .map((u) => {
        const match = u.username.match(new RegExp(`^${baseUsername}_(\\d+)$`))
        return match ? parseInt(match[1], 10) : null
      })
      .filter((n) => n !== null) as number[]
    const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1
    return `${baseUsername}_${nextNumber}`
  }

  async createUser(input: CreateUserInput) {
    return await this.prisma.user.create({
      data: {
        ...input,
        username: await this.generateUsername(input.firstName, input.lastName),
      },
    })
  }

  async getAllUser() {
    return await this.prisma.user.findMany()
  }

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } })
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findUserByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
    })
  }

  async updateUserInfo(userId: string, input: UpdateUserInput) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: input,
    })
  }
}
