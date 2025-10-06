import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateBlogInput {
  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  content?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  thumbnail?: string
}
