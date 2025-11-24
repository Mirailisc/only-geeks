import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { User } from './entities/user.entity'
import { AdminService } from 'src/admin/admin.service'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly adminService: AdminService,
  ) {}

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

  async checkPostingRestriction(userId: string): Promise<boolean> {
    // verify that user exists and no restriction "NO_POSTING"
    const user = await this.findUserById(userId)
    if (!user) throw new BadRequestException('User not found')

    const myRestriction = await Promise.all(
      await this.adminService.getActiveUserRestrictions(userId),
    )
    const now = new Date()
    const noPostRestrictions = myRestriction.find(
      (restriction) =>
        restriction.type === 'NO_POSTING' && restriction.expiresAt > now,
    )
    if (noPostRestrictions)
      throw new BadRequestException(
        'You are restricted from posting new projects.',
      )
    return true
  }

  async createOauthUser(input: CreateUserInput): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...input,
        username: await this.generateUsername(input.firstName, input.lastName),
        type: 'oauth',
        preference: {
          create: {}, // will use defaults from model
        },
      },
      include: { preference: true },
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
        preference: {
          create: {}, // will use defaults from model
        },
      },
    })
  }

  async getAllUser() {
    return await this.prisma.user.findMany()
  }

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } })
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { preference: true },
    })
    return user
  }

  async findUserByUsername(
    username: string,
  ): Promise<User & { password?: string }> {
    return await this.prisma.user.findUnique({
      where: { username, isActive: true },
      include: { preference: true },
    })
  }

  async getUserProfileByUsername(
    username: string,
    currentUserId: string | null,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { preference: true },
    })
    if (!user) throw new BadRequestException('USER_NOT_FOUND')
    if (user.id === currentUserId) {
      if (user.password) {
        delete user.password
      }
      return user
    } else if (user.preference.isPublicProfile) {
      if (user.password) {
        delete user.password
      }
      return user
    } else {
      throw new BadRequestException('USER_NOT_FOUND')
    }
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

  async searchQuery(searchQuery: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            firstName: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            bio: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
    })
  }
}
