import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthService } from '../auth.service'

@Injectable()
export class GqlAuthGuard {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext()
    const token = ctx.req.cookies['access_token']

    if (!token) {
      throw new UnauthorizedException()
    }

    const user = await this.authService.getUserFromToken(token)

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    ctx.req.user = user
    return true
  }
}
