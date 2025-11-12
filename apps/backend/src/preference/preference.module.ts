import { forwardRef, Module } from '@nestjs/common'
import { PreferenceService } from './preference.service'
import { PreferenceResolver } from './preference.resolver'
import { AuthModule } from 'src/auth/auth.module'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [PreferenceResolver, PreferenceService, PrismaService],
  exports: [PreferenceService],
})
export class PreferenceModule {}
