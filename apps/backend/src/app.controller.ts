import { Controller, Get, Req, Res } from '@nestjs/common'
import { join } from 'path'
import { Request, Response } from 'express'

@Controller()
export class AppController {
  @Get('*')
  serveApp(@Req() req: Request, @Res() res: Response) {
    if (req.path.startsWith('/auth') || req.path.startsWith('/graphql')) {
      return res.status(404).send('Not Found')
    }

    return res.sendFile(join(__dirname, '..', 'public', 'index.html'))
  }
}
