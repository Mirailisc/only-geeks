import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateOrCreateUser({
    email,
    firstName,
    lastName,
  }: {
    email: string
    firstName: string
    lastName: string
  }) {
    let user = await this.userService.findUserByEmail(email)

    if (!user) {
      user = await this.userService.createUser({
        email,
        firstName,
        lastName,
      })
    }

    return user
  }

  async generateJwt(user: User) {
    return this.jwtService.sign({ email: user.email, sub: user.id })
  }
}
