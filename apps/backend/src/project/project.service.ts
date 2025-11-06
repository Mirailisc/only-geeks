import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProjectInput } from './dto/create-project.input'
import { UpdateProjectInput } from './dto/update-project.input'
import { UserService } from 'src/user/user.service'

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, input: CreateProjectInput) {
    return await this.prisma.project.create({
      data: { ...input, userId },
      include: { User: true },
    })
  }

  async findAllByUser(userId: string) {
    return await this.prisma.project.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      include: { User: true },
    })
  }

  async findAllByUsername(username: string) {
    const user = await this.userService.findUserByUsername(username)
    if (!user) throw new BadRequestException('User not found')
    return await this.prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { startDate: 'desc' },
      include: { User: true },
    })
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { User: true },
    })
    if (!project) throw new BadRequestException('Project not found')
    return project
  }

  async update(id: string, input: UpdateProjectInput) {
    const existing = await this.findOne(id)
    return await this.prisma.project.update({
      where: { id: existing.id },
      data: input,
      include: { User: true },
    })
  }

  async remove(id: string) {
    const existing = await this.findOne(id)
    await this.prisma.project.delete({
      where: { id: existing.id },
      include: { User: true },
    })
    return true
  }
}
