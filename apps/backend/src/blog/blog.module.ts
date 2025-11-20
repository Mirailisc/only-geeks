import { forwardRef, Module } from '@nestjs/common'
import { BlogService } from './blog.service'
import { BlogResolver } from './blog.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'
import { AdminModule } from 'src/admin/admin.module'

@Module({
  imports: [forwardRef(() => AuthModule), UserModule, AdminModule],
  providers: [BlogResolver, BlogService, PrismaService],
})
export class BlogModule {}
