import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/entities/user.entity'

@ObjectType()
export class Blog {
  @Field(() => String)
  id: string

  @Field(() => String)
  userId: string

  @Field(() => String)
  slug: string

  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  content?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  thumbnail?: string

  @Field(() => Boolean)
  isPublished: boolean

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Boolean, { nullable: true })
  requestEdit?: boolean

  @Field(() => Boolean, { nullable: true })
  requestUnpublish?: boolean

  @Field(() => Boolean, { nullable: true })
  isResponse?: boolean

  @Field(() => User, { nullable: true })
  User?: User
}
