import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class Achievement {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  issuer?: string

  @Field({ nullable: true })
  date?: Date

  @Field(() => [String], { nullable: true })
  photos?: string[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
