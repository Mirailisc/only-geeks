import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class Project {
  @Field(() => ID) id: string
  @Field() title: string
  @Field({ nullable: true }) description?: string
  @Field({ nullable: true }) link?: string
  @Field(() => [String], { nullable: true }) photos?: string[]
  @Field({ nullable: true }) startDate?: Date
  @Field({ nullable: true }) endDate?: Date
}
