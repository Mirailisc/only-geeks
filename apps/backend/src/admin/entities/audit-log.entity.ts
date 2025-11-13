import { ObjectType, Field, ID } from '@nestjs/graphql'
import { User } from 'src/user/entities/user.entity'

@ObjectType()
export class AdminAuditLog {
  @Field(() => ID)
  id: string

  @Field()
  adminId: string

  @Field()
  actionType: string

  @Field()
  targetType: string

  @Field({ nullable: true })
  targetId?: string

  @Field({ nullable: true })
  details?: string

  @Field()
  createdAt: Date

  @Field(() => User, { nullable: true })
  admin?: User
}
