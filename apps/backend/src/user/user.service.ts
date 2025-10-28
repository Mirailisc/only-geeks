import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

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

  async createOauthUser(input: CreateUserInput) {
    return await this.prisma.user.create({
      data: {
        ...input,
        username: await this.generateUsername(input.firstName, input.lastName),
        type: 'oauth',
      },
    })
  }

  async createLocalUser(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10)

    const emailHash = crypto
      .createHash('md5')
      .update(input.email.trim().toLowerCase())
      .digest('hex')
    const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`

    return await this.prisma.user.create({
      data: {
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        picture: gravatarUrl,
        password: hashedPassword,
        type: 'local',
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
    const user = await this.findUserById(userId)

    if (user.username !== input.username) {
      const existingUser = await this.findUserByUsername(input.username)

      if (existingUser) {
        throw new BadRequestException('Username already exists')
      }
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: input,
    })
  }
}
