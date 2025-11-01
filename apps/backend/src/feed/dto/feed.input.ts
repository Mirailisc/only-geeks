import { Field, InputType, registerEnumType } from '@nestjs/graphql'

export enum FeedType {
  BLOG = 'BLOG',
  PROJECT = 'PROJECT',
  AWARD = 'AWARD',
  ALL = 'ALL',
}

registerEnumType(FeedType, { name: 'FeedType' })

@InputType()
export class FeedInput {
  @Field(() => FeedType, { defaultValue: FeedType.ALL })
  type: FeedType

  @Field(() => String, { nullable: true })
  cursor?: string

  @Field(() => Number, { defaultValue: 10 })
  limit: number
}
