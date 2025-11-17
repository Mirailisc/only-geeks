import { forwardRef, Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { GoogleStrategy } from './strategies/google.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ReportModule } from 'src/report/report.module'
import { AdminModule } from 'src/admin/admin.module'

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ReportModule),
    forwardRef(() => AdminModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
