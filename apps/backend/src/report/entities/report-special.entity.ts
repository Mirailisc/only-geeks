import { Field, ObjectType } from '@nestjs/graphql'
import { Project } from 'src/project/entities/project.entity'
import { Blog } from 'src/blog/entities/blog.entity'
import { User } from 'src/user/entities/user.entity'

@ObjectType()
export class UserReport {
  @Field(() => String)
  id: string

  @Field(() => String)
  reportId: string

  @Field(() => String)
  targetId: string

  @Field(() => User, { nullable: true })
  target: User
}

@ObjectType()
export class ProjectReport {
  @Field(() => String)
  id: string

  @Field(() => String)
  reportId: string

  @Field(() => String)
  targetId: string

  @Field(() => Project, { nullable: true })
  target: Project
}

@ObjectType()
export class BlogReport {
  @Field(() => String)
  id: string

  @Field(() => String)
  reportId: string

  @Field(() => String)
  targetId: string

  @Field(() => Blog, { nullable: true })
  target: Blog
}
