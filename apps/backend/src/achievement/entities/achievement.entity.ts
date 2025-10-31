import { ObjectType, Field, ID } from '@nestjs/graphql'
import { User } from 'src/user/entities/user.entity'

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

  @Field(() => User, { nullable: true })
  User?: User
}
