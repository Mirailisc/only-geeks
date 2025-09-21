import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserInput } from './dto/create-user.input'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUser() {
    return await this.prisma.user.findMany()
  }

  async createUser(input: CreateUserInput) {
    return await this.prisma.user.create({ data: input })
  }
}
