import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class Education {
  @Field(() => ID) id: string
  @Field() school?: string
  @Field() degree?: string
  @Field({ nullable: true }) fieldOfStudy?: string
  @Field({ nullable: true }) startDate?: Date
  @Field({ nullable: true }) endDate?: Date
}
