import { InputType, Field } from '@nestjs/graphql'
import { RestrictionType } from '../entities/restriction.entity'

@InputType()
export class CreateUserRestrictionInput {
  @Field()
  userId: string

  @Field(() => RestrictionType)
  type: RestrictionType

  @Field({ nullable: true })
  reason?: string

  @Field({ nullable: true })
  expiresAt?: Date
}
