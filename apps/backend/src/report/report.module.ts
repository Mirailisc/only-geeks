import { forwardRef, Module } from '@nestjs/common'
import { ReportService } from './report.service'
import { ReportResolver } from './report.resolver'
import { AuthModule } from 'src/auth/auth.module'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [ReportResolver, ReportService, PrismaService],
  exports: [ReportService],
})
export class ReportModule {}
