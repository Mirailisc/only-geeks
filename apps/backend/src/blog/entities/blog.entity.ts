import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Blog {
  @Field(() => String)
  id: string

  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  content?: string

  @Field(() => Boolean)
  isPublish: boolean

  @Field(() => String)
  userId: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
