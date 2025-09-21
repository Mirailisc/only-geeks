import { Resolver, Query } from '@nestjs/graphql'
import { HealthService } from './health.service'
import { Health } from './entities/health.entity'

@Resolver(() => Health)
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {}

  @Query(() => Health)
  getHealth() {
    return this.healthService.getHealth()
  }
}
