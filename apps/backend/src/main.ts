import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

const DEFAULT_PORT = 4000

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.enableCors({
    origin: [process.env.URL ?? 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
      'Content-Type',
      'Baggage',
    ],
  })
  app.use(cookieParser())

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  await app.listen(process.env.PORT ?? DEFAULT_PORT)
}
bootstrap()
