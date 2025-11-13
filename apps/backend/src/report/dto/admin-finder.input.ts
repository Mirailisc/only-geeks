import { InputType, Field, Int } from '@nestjs/graphql'
import { ReportStatus } from '../entities/report.entity'

// export class UpdateReportInput extends PartialType(CreateReportInput) {
//   @Field(() => Int)
//   id: number
// }

@InputType()
export class AdminFinderInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => Int, { nullable: true })
  limit?: number = 10

  @Field(() => Int, { nullable: true })
  page?: number = 1

  @Field(() => String, { nullable: true })
  status?: ReportStatus = ReportStatus.ALL
}
