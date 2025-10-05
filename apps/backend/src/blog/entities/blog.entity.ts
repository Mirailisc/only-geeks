import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/entities/user.entity'

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
  slug: string

  @Field(() => String)
  userId: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => User, { nullable: true })
  user?: User
}
