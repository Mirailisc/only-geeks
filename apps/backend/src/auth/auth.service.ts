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
    picture,
  }: {
    email: string
    firstName: string
    lastName: string
    picture: string
  }) {
    let user = await this.userService.findUserByEmail(email)

    if (!user) {
      user = await this.userService.createUser({
        email,
        firstName,
        lastName,
        picture,
      })
    }

    return user
  }

  async generateJwt(user: User) {
    return this.jwtService.sign({ email: user.email, sub: user.id })
  }

  async getUserFromToken(token: string) {
    const payload = this.jwtService.verify(token)

    return await this.userService.findUserById(payload.sub)
  }
}
