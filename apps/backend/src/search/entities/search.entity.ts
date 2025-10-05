import { ObjectType, Field } from '@nestjs/graphql'
import { Blog } from 'src/blog/entities/blog.entity'
import { User } from 'src/user/entities/user.entity'

@ObjectType()
export class Search {
  @Field(() => [User])
  users: User[]

  @Field(() => [Blog])
  blogs: Blog[]
}
