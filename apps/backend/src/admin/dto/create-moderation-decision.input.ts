import { InputType, Field } from '@nestjs/graphql'
import { ModerationAction } from 'src/report/entities/report.entity'

@InputType()
export class CreateModerationDecisionInput {
  @Field()
  reportId: string

  @Field(() => String)
  action: ModerationAction

  @Field({ nullable: true })
  note?: string
}
