import { InputType, Field } from '@nestjs/graphql'
import { ReportCategory, TargetType } from '../entities/report.entity'

@InputType()
export class CreateReportInput {
  @Field(() => String)
  targetType: TargetType

  @Field(() => String)
  targetId: string

  @Field(() => String)
  reason: string

  @Field(() => String)
  category: ReportCategory
}
