import { Test, TestingModule } from '@nestjs/testing';
import { EducationResolver } from './education.resolver';

describe('EducationResolver', () => {
  let resolver: EducationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationResolver],
    }).compile();

    resolver = module.get<EducationResolver>(EducationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
