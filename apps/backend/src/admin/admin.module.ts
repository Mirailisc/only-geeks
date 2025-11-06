import { forwardRef, Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminResolver } from './admin.resolver'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [AdminResolver, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
