import { forwardRef, Module } from '@nestjs/common'
import { AchievementService } from './achievement.service'
import { AchievementResolver } from './achievement.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [AchievementResolver, AchievementService, PrismaService],
  exports: [AchievementService],
})
export class AchievementModule {}
