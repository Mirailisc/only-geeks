import { ObjectType, Field, ID } from '@nestjs/graphql'
import { ModerationAction, Report } from 'src/report/entities/report.entity'
import { User } from 'src/user/entities/user.entity'

@ObjectType()
export class ModerationDecision {
  @Field(() => ID)
  id: string

  @Field()
  adminId: string

  @Field()
  reportId: string

  @Field(() => ModerationAction)
  action: ModerationAction

  @Field(() => Boolean, { nullable: true })
  isResponse?: boolean

  @Field({ nullable: true })
  note?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => User, { nullable: true })
  admin?: User

  @Field(() => Report, { nullable: true })
  report?: Report
}
