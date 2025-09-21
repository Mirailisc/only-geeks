import { Resolver, Query, Context, Mutation } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'src/user/entities/user.entity'
import { GqlAuthGuard } from './guards/graphql-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { UserService } from 'src/user/user.service'
import { ConfigService } from '@nestjs/config'
import { ACCESS_TOKEN } from 'src/constants/cookie'
import { Response } from 'express'

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Query(() => String)
  async getGoogleOauthUrl(): Promise<string> {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
      redirect_uri: `${this.configService.get<string>('BACKEND_URL')}/auth/google/callback`,
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
    }

    const qs = new URLSearchParams(options).toString()
    return `${rootUrl}?${qs}`
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: any): Promise<User> {
    return this.userService.findUserByEmail(user.email)
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: any): Promise<boolean> {
    const res: Response = context.res
    res.clearCookie(ACCESS_TOKEN)
    return true
  }
}
