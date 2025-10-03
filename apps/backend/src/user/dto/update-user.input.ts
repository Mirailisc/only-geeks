import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  bio?: string

  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String, { nullable: false })
  username: string

  @Field(() => String, { nullable: true })
  location?: string

  @Field(() => String, { nullable: true })
  organization?: string
}
