import { ObjectType, Field, ID } from '@nestjs/graphql'
import { User } from 'src/user/entities/user.entity'

@ObjectType()
export class Project {
  @Field(() => ID) id: string
  @Field() title: string
  @Field({ nullable: true }) description?: string
  @Field({ nullable: true }) link?: string
  @Field(() => [String], { nullable: true }) photos?: string[]
  @Field({ nullable: true }) startDate?: Date
  @Field({ nullable: true }) endDate?: Date
  @Field(() => User, { nullable: true }) User?: User
}
