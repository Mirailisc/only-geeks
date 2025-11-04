import { Field, ObjectType } from '@nestjs/graphql'
import { PreferenceEntity } from 'src/preference/entities/preference.entity'

@ObjectType()
export class User {
  @Field(() => String)
  id: string

  @Field(() => String)
  username: string

  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String)
  email: string

  @Field(() => String, { nullable: true })
  bio?: string

  @Field(() => String, { nullable: true })
  picture?: string

  @Field(() => String, { nullable: true })
  location?: string

  @Field(() => String, { nullable: true })
  organization?: string

  @Field(() => Boolean)
  isAdmin: boolean

  @Field(() => PreferenceEntity, { nullable: true })
  preference?: PreferenceEntity

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
