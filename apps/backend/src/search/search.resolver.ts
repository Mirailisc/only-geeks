import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchService } from './search.service'
import { Search } from './entities/search.entity'
import { SearchInput } from './dto/search.input'

@Resolver(() => Search)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => Search)
  async search(@Args('input') input: SearchInput): Promise<Search> {
    return this.searchService.search(input)
  }

  @Query(() => Search)
  async searchSuggest(@Args('input') input: SearchInput): Promise<Search> {
    return this.searchService.searchSuggest(input)
  }
}
