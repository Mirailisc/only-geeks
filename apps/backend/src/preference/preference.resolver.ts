import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { PreferenceService } from './preference.service'
import { PreferenceInput } from './dto/preference.input'
import { PreferenceEntity } from './entities/preference.entity'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/graphql-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
@Resolver()
export class PreferenceResolver {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Mutation(() => PreferenceEntity)
  @UseGuards(GqlAuthGuard)
  async updatePreference(
    @Args('input') input: PreferenceInput,
    @CurrentUser() user: any,
  ) {
    return await this.preferenceService.updatePreference(
      user.id,
      input.currentTheme,
      input.isPublicProfile,
    )
  }
}
