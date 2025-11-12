import { Test, TestingModule } from '@nestjs/testing'
import { PreferenceResolver } from './preference.resolver'
import { PreferenceService } from './preference.service'

describe('PreferenceResolver', () => {
  let resolver: PreferenceResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreferenceResolver, PreferenceService],
    }).compile()

    resolver = module.get<PreferenceResolver>(PreferenceResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
