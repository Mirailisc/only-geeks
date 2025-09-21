import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { GoogleStrategy } from './strategies/google.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthResolver, AuthService, GoogleStrategy],
})
export class AuthModule {}
