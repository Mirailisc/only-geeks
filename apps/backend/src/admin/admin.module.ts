import { forwardRef, Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminResolver } from './admin.resolver'
import { AuthModule } from 'src/auth/auth.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { ReportModule } from 'src/report/report.module'

@Module({
  imports: [forwardRef(() => AuthModule), ReportModule],
  providers: [AdminResolver, AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
