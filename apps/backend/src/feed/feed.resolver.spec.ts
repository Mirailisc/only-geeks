import { Test, TestingModule } from '@nestjs/testing'
import { FeedResolver } from './feed.resolver'
import { FeedService } from './feed.service'

describe('FeedResolver', () => {
  let resolver: FeedResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedResolver, FeedService],
    }).compile()

    resolver = module.get<FeedResolver>(FeedResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
