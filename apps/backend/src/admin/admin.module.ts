import { forwardRef, Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminResolver } from './admin.resolver'
import { AuthModule } from 'src/auth/auth.module'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [AdminResolver, AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
