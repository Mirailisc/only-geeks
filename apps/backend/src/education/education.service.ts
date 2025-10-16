import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateEducationInput } from './dto/create-education.input'
import { UpdateEducationInput } from './dto/update-education.input'

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateEducationInput) {
    return await this.prisma.education.create({
      data: { ...input, userId },
    })
  }

  async findAllByUser(userId: string) {
    return await this.prisma.education.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    })
  }

  async findOne(id: string) {
    const edu = await this.prisma.education.findUnique({ where: { id } })
    if (!edu) throw new BadRequestException('Education not found')
    return edu
  }

  async update(id: string, input: UpdateEducationInput) {
    const existing = await this.findOne(id)
    return await this.prisma.education.update({
      where: { id: existing.id },
      data: input,
    })
  }

  async remove(id: string) {
    const existing = await this.findOne(id)
    await this.prisma.education.delete({ where: { id: existing.id } })
    return true
  }
}
