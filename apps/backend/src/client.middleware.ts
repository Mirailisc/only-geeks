import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { join } from 'path'

@Injectable()
export class SpaFallbackMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'GET') {
      return next()
    }

    if (req.path.startsWith('/auth') || req.path.startsWith('/graphql')) {
      return next()
    }

    res.sendFile(join(__dirname, '..', 'public', 'index.html'), (err) => {
      if (err) {
        next(err)
      }
    })
  }
}
