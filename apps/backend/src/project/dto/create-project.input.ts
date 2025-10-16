import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateProjectInput {
  @Field() title: string
  @Field({ nullable: true }) description?: string
  @Field({ nullable: true }) link?: string
  @Field({ nullable: true }) startDate?: Date
  @Field({ nullable: true }) endDate?: Date
  @Field(() => [String], { nullable: true }) photos?: string[]
}
