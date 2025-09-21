import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const ctxType = context.getType<'graphql' | 'http'>()

    let req
    if (ctxType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext()
      req = gqlCtx.req
    } else {
      req = context.switchToHttp().getRequest()
    }

    const token = req.cookies?.['access_token']
    if (!token) throw new UnauthorizedException('No access token found')

    const jwtService = new JwtService({ secret: process.env.JWT_SECRET })
    try {
      const user = jwtService.verify(token)
      return user
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }
  },
)
