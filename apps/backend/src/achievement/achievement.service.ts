import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateAchievementInput } from './dto/create-achievement.input'
import { UpdateAchievementInput } from './dto/update-achievement.input'

@Injectable()
export class AchievementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateAchievementInput) {
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

  async findOne(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
    })
    if (!achievement) throw new BadRequestException('Achievement not found')
    return achievement
  }

  async update(id: string, input: UpdateAchievementInput) {
    const existing = await this.findOne(id)
    return await this.prisma.achievement.update({
      where: { id: existing.id },
      data: input,
    })
  }

  async remove(id: string) {
    const existing = await this.findOne(id)
    await this.prisma.achievement.delete({ where: { id: existing.id } })
    return true
  }
}
