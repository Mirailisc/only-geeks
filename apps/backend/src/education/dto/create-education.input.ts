import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateEducationInput {
  @Field({ nullable: true }) school?: string
  @Field({ nullable: true }) degree?: string
  @Field({ nullable: true }) fieldOfStudy?: string
  @Field({ nullable: true }) startDate?: Date
  @Field({ nullable: true }) endDate?: Date
}
