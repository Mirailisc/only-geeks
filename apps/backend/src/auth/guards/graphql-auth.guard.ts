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

@Injectable()
export class OptionalGqlAuthGuard {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext()
    const token = ctx.req.cookies['access_token']
    let user
    if (token) {
      user = await this.authService.getUserFromToken(token)
    } else {
      user = {
        id: 'special-guest-id',
        email: 'special-guest@example.com',
        username: 'special_guest',
        firstName: 'Special',
        lastName: 'Guest',
        password: 'guest_password',
        bio: 'This is a special guest account.',
        picture: 'https://example.com/special-guest.jpg',
        location: 'Wonderland',
        organization: 'Guest Organization',
        type: 'guest',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    ctx.req.user = user
    return true
  }
}

@Injectable()
export class AdminGqlAuthGuard {
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

    if (!user.isAdmin) {
      throw new UnauthorizedException('Admin access required')
    }

    ctx.req.user = user
    return true
  }
}
