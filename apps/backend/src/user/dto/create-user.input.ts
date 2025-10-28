import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: true })
  username?: string | null

  @Field(() => String)
  firstName: string

  @Field(() => String)
  lastName: string

  @Field(() => String)
  email: string

  @Field(() => String, { nullable: true })
  picture?: string | null

  @Field(() => String, { nullable: true })
  password?: string | null
}
