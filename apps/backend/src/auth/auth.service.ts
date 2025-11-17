import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'
import { LoginInput } from './dto/login.input'
import { RegisterInput } from './dto/register.input'
import * as bcrypt from 'bcrypt'
import { ReportService } from 'src/report/report.service'
import { AdminService } from 'src/admin/admin.service'
import { Response } from 'express'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly reportService: ReportService,
    private readonly adminService: AdminService,
  ) {}

  async checkWarningsAndRestrictions(
    user: User,
    res: Response | null = null,
    redirectDomain: string | null = null,
  ) {
    console.log('Checking warnings and restrictions for user:', user.id)
    const myWarning = await Promise.all(
      await this.reportService.findAllMyWarnings(user.id),
    )
    const deactivateWarning = myWarning.find(
      (report) => report?.decision?.action === 'DEACTIVATE',
    )

    if (deactivateWarning) {
      if (res && redirectDomain)
        res.redirect(`${redirectDomain}/login?error=deactivated`)
      throw new UnauthorizedException(
        'Your account has been deactivated due to violations of our community guidelines.',
      )
    }

    const myRestriction = await Promise.all(
      await this.adminService.getUserRestrictionsByUserId(user.id),
    )

    const now = new Date()

    const tempbanWarning = myRestriction.find(
      (restriction) =>
        restriction.type === 'TEMP_BAN' && restriction.expiresAt > now,
    )

    if (tempbanWarning) {
      if (res && redirectDomain) {
        res.redirect(`
          ${redirectDomain}/login?error=temp_ban&expiresAt=${tempbanWarning.expiresAt.getTime()}
        `)
      }
      throw new UnauthorizedException(
        `Your account is temporarily banned until ${tempbanWarning.expiresAt.toLocaleString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          },
        )}`,
      )
    }
  }

  async login(input: LoginInput) {
    const user = await this.userService.findUserByUsername(input.username)

    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect')
    }

    const isPasswordMatch = bcrypt.compare(input.password, user.password)

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Username or password is incorrect')
    }

    await this.checkWarningsAndRestrictions(user)

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
