import { forwardRef, Module } from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectResolver } from './project.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [forwardRef(() => AuthModule), UserModule],
  providers: [ProjectResolver, ProjectService, PrismaService],
  exports: [ProjectService],
})
export class ProjectModule {}
