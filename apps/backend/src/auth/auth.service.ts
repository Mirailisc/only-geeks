import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'
import { LoginInput } from './dto/login.input'
import { RegisterInput } from './dto/register.input'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(input: LoginInput) {
    const user = await this.userService.findUserByUsername(input.username)

    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect')
    }

    const isPasswordMatch = bcrypt.compare(input.password, user.password)

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Username or password is incorrect')
    }

    const token = await this.generateJwt(user)
    return token
  }

  async register(input: RegisterInput) {
    const exitingEmail = await this.userService.findUserByEmail(input.email)
    const exitingUsername = await this.userService.findUserByUsername(
      input.username,
    )

    if (exitingEmail || exitingUsername) {
      throw new UnauthorizedException('User already exists')
    }

    return await this.userService.createLocalUser(input)
  }

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
      user = await this.userService.createOauthUser({
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
