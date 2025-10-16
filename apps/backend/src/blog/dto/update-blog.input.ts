import { Field, InputType } from '@nestjs/graphql'
import { CreateBlogInput } from './create-blog.input'

@InputType()
export class UpdateBlogInput extends CreateBlogInput {
  @Field(() => Boolean, { nullable: true })
  isPublished?: boolean
}
