import { Resolver, Query, Context, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'src/user/entities/user.entity'
import { GqlAuthGuard } from './guards/graphql-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { UserService } from 'src/user/user.service'
import { ConfigService } from '@nestjs/config'
import { ACCESS_TOKEN } from 'src/constants/cookie'
import { Response } from 'express'
import { AuthUser } from './entities/auth-user.entity'

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Query(() => String)
  async getGoogleOauthUrl(@Args('state') state: string): Promise<string> {
    console.log('Generating Google OAuth URL with state:', state)
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
      redirect_uri: `${this.configService.get<string>('BACKEND_URL')}/auth/google/callback`,
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      state: state ?? '/profile', // Redirect url after login state --This will be dynamic later--
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
    }

    const qs = new URLSearchParams(options).toString()
    return `${rootUrl}?${qs}`
  }

  @Query(() => AuthUser)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: any): Promise<AuthUser> {
    const me = await this.userService.findUserByEmail(user.email)
    return {
      email: me.email,
      username: me.username,
      firstName: me.firstName,
      lastName: me.lastName,
      isAdmin: me.isAdmin,
      picture: me.picture,
    }
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: any): Promise<boolean> {
    const res: Response = context.res
    res.clearCookie(ACCESS_TOKEN)
    return true
  }
}
