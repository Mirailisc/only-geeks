import { forwardRef, Module } from '@nestjs/common'
import { FeedService } from './feed.service'
import { FeedResolver } from './feed.resolver'
import { AuthModule } from 'src/auth/auth.module'
import { PrismaService } from 'src/prisma/prisma.service'
@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [FeedResolver, FeedService, PrismaService],
  exports: [FeedService],
})
export class FeedModule {}
