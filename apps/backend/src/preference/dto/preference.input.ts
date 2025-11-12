import { Field, InputType } from '@nestjs/graphql'

export type ThemeType = 'LIGHT' | 'DARK' | 'SYSTEM'
@InputType()
export class PreferenceInput {
  @Field(() => String, { nullable: true })
  currentTheme?: ThemeType

  @Field(() => Boolean, { nullable: true })
  isPublicProfile?: boolean
}
