import { forwardRef, Module } from '@nestjs/common'
import { EducationService } from './education.service'
import { EducationResolver } from './education.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [EducationResolver, EducationService, PrismaService],
  exports: [EducationService],
})
export class EducationModule {}
