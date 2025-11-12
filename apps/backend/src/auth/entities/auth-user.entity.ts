import { Field, ObjectType } from '@nestjs/graphql'
import { PreferenceEntity } from 'src/preference/entities/preference.entity'

@ObjectType()
export class AuthUser {
  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String)
  username: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String)
  email: string

  @Field(() => Boolean)
  isAdmin: boolean

  @Field(() => String, { nullable: true })
  picture?: string

  @Field(() => PreferenceEntity, { nullable: true })
  preferences?: PreferenceEntity
}
