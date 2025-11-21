import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql'
import { User } from 'src/user/entities/user.entity'

export enum RestrictionType {
  TEMP_BAN = 'TEMP_BAN',
  NO_POSTING = 'NO_POSTING',
}

registerEnumType(RestrictionType, {
  name: 'RestrictionType',
})

@ObjectType()
export class UserRestriction {
  @Field(() => ID)
  id: string

  @Field()
  userId: string

  @Field(() => RestrictionType)
  type: RestrictionType

  @Field({ nullable: true })
  reason?: string

  @Field({ nullable: true })
  expiresAt?: Date

  @Field()
  createdAt: Date

  @Field({ nullable: true })
  user?: User
}
