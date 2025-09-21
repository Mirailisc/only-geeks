import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class GqlAuthGuard {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext()
    const req = ctx.req

    const token = req.cookies?.['access_token']
    if (!token) throw new UnauthorizedException('No token found')

    try {
      const payload = this.jwtService.verify(token)
      req.user = payload
      return true
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
