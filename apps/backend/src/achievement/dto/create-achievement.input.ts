import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateAchievementInput {
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
}
