import { InputType, PartialType } from '@nestjs/graphql'
import { CreateAchievementInput } from './create-achievement.input'

@InputType()
export class UpdateAchievementInput extends PartialType(
  CreateAchievementInput,
) {}
