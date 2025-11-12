import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ThemeType } from '../dto/preference.input'

@ObjectType()
export class PreferenceEntity {
  @Field(() => ID)
  id: string

  @Field(() => String)
  userId: string

  @Field(() => String)
  currentTheme: ThemeType

  @Field(() => Boolean)
  isPublicProfile: boolean

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
