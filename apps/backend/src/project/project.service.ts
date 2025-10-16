import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProjectInput } from './dto/create-project.input'
import { UpdateProjectInput } from './dto/update-project.input'

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateProjectInput) {
    return await this.prisma.project.create({
      data: { ...input, userId },
    })
  }

  async findAllByUser(userId: string) {
    return await this.prisma.project.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    })
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } })
    if (!project) throw new BadRequestException('Project not found')
    return project
  }

  async update(id: string, input: UpdateProjectInput) {
    const existing = await this.findOne(id)
    return await this.prisma.project.update({
      where: { id: existing.id },
      data: input,
    })
  }

  async remove(id: string) {
    const existing = await this.findOne(id)
    await this.prisma.project.delete({ where: { id: existing.id } })
    return true
  }
}
