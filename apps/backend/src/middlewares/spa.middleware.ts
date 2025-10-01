import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { join } from 'path'

@Injectable()
export class SpaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/auth') || req.path.startsWith('/graphql')) {
      return next()
    }

    if (req.path.match(/\.\w+$/)) {
      return next()
    }

    res.sendFile(join(__dirname, '..', 'public', 'index.html'))
  }
}
