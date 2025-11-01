import { forwardRef, Module } from '@nestjs/common'
import { EducationService } from './education.service'
import { EducationResolver } from './education.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [forwardRef(() => AuthModule), UserModule],
  providers: [EducationResolver, EducationService, PrismaService],
  exports: [EducationService],
})
export class EducationModule {}
