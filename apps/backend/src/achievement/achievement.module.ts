import { forwardRef, Module } from '@nestjs/common'
import { AchievementService } from './achievement.service'
import { AchievementResolver } from './achievement.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [forwardRef(() => AuthModule), UserModule],
  providers: [AchievementResolver, AchievementService, PrismaService],
  exports: [AchievementService],
})
export class AchievementModule {}
