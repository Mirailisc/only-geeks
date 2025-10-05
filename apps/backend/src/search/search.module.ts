import { Module } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchResolver } from './search.resolver'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  providers: [SearchResolver, SearchService, PrismaService],
})
export class SearchModule {}
