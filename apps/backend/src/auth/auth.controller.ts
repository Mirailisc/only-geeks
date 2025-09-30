import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { ACCESS_TOKEN } from 'src/constants/cookie'
import { ConfigService } from '@nestjs/config'
import axios, { isAxiosError } from 'axios'
import { ForbiddenError } from '@nestjs/apollo'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string

    if (!code) {
      throw new BadRequestException('Code not found')
    }

    try {
      const params = new URLSearchParams()
      params.append('code', code)
      params.append(
        'client_id',
        this.configService.get<string>('GOOGLE_CLIENT_ID')!,
      )
      params.append(
        'client_secret',
        this.configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      )
      params.append(
        'redirect_uri',
        `${this.configService.get<string>('BACKEND_URL')}/auth/google/callback`,
      )
      params.append('grant_type', 'authorization_code')

      const tokenRes = await axios.post(
        'https://oauth2.googleapis.com/token',
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      )

      const accessToken = tokenRes.data.access_token
      if (!accessToken) {
        throw new UnauthorizedException('Failed to retrieve access token')
      }

      const userRes = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )

      const { email, given_name, family_name, picture } = userRes.data
      if (!email || !given_name || !family_name) {
        throw new UnauthorizedException(
          'Failed to retrieve user info from Google',
        )
      }

      const user = await this.authService.validateOrCreateUser({
        email,
        firstName: given_name,
        lastName: family_name,
        picture,
      })

      const token = await this.authService.generateJwt(user)

      res.cookie(ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.redirect(
        this.configService.get<string>('FRONTEND_URL') + '/profile',
      )
    } catch (err) {
      console.error(isAxiosError(err) ? err.response?.data || err.message : err)
      throw new UnauthorizedException(
        isAxiosError(err) ? err.response?.data || err.message : err,
      )
    }
  }

  @Post('test-login')
  async testLogin(@Req() req: Request, @Res() res: Response) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenError('Test login is not allowed in production')
    }

    const { email } = req.body

    const user = await this.authService.validateOrCreateUser({
      email,
      firstName: 'Test',
      lastName: 'User',
      picture: '',
    })

    const token = await this.authService.generateJwt(user)

    res.cookie(ACCESS_TOKEN, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({ message: 'Logged in' })
  }
}
