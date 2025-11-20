import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateAchievementInput } from './dto/create-achievement.input'
import { UpdateAchievementInput } from './dto/update-achievement.input'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AchievementService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, input: CreateAchievementInput) {
    await this.userService.checkPostingRestriction(userId)

    return await this.prisma.achievement.create({
      data: { ...input, userId },
    })
  }

  async findAllByUser(userId: string) {
    return await this.prisma.achievement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    })
  }

  async findAllByUsername(username: string) {
    const user = await this.userService.findUserByUsername(username)
    if (!user) throw new BadRequestException('User not found')
    return await this.prisma.achievement.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    })
  }

  async findOne(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
    })
    if (!achievement) throw new BadRequestException('Achievement not found')
    return achievement
  }

  async update(id: string, userId: string, input: UpdateAchievementInput) {
    await this.userService.checkPostingRestriction(userId)

    const existing = await this.findOne(id)
    return await this.prisma.achievement.update({
      where: { id: existing.id },
      data: input,
    })
  }

  async remove(id: string, userId: string) {
    await this.userService.checkPostingRestriction(userId)

    const existing = await this.findOne(id)
    await this.prisma.achievement.delete({ where: { id: existing.id } })
    return true
  }
}
