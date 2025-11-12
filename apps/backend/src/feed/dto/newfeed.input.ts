import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class NewFeedCountInput {
  @Field(() => String)
  since: string
}
