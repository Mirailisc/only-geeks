import { GET_REPORT_COUNTS_BY_STATUS } from "@/graphql/admin";
import { useQuery } from "@apollo/client/react";
import { CheckCircleIcon, ClockIcon, ListChecksIcon, SearchIcon, ShieldCheckIcon, XCircleIcon, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { REPORT_STATUS_TEXT, ReportStatusList, type ReportStatus, type ReportStatusSummary } from "@/graphql/report";
// export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'ALL'
// export interface ReportStatusSummary {
//   ALL: number
//   PENDING: number
//   REJECTED: number
//   RESOLVED: number
//   UNDER_REVIEW: number
// }
const ReportStatusIconColor: Record<ReportStatus,{ className: string; icon: LucideIcon }> = {
  PENDING: { className: "bg-yellow-500", icon: ClockIcon },
  UNDER_REVIEW: { className: "bg-blue-500", icon: SearchIcon },
  RESOLVED: { className: "bg-green-500", icon: CheckCircleIcon },
  REJECTED: { className: "bg-red-500", icon: XCircleIcon },
  ALL: { className: "bg-gray-500", icon: ListChecksIcon },
}
export const DashboardTab = () => {
  const {data: reportCountsData, loading: reportCountsLoading} = useQuery<{countReportsByStatus: ReportStatusSummary}>(GET_REPORT_COUNTS_BY_STATUS)
  // const { data: auditLogsData, loading: auditLogsLoading } = useQuery<{getAllAuditLogs: AdminAuditLog[]}>(GET_ALL_AUDIT_LOGS);
  return (
    <>
      <div className="space-y-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheckIcon className="h-8 w-8" /> Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage reports, user restrictions, and monitor platform activity
          </p>
        </div>
      </div>
      <h2 className="text-xl font-medium mb-2">Report Statistics</h2>
      <div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'}>
        {
          ReportStatusList.map((status: ReportStatus) => {
            const { icon: StatusIcon, className } = ReportStatusIconColor[status]
            return (
              <Card key={status} className="">
                <CardContent className="flex flex-row gap-2 items-center justify-end text-right">
                  <div>
                    <CardTitle className="flex flex-row items-center justify-end gap-2 text-xl font-medium">{REPORT_STATUS_TEXT[status]}</CardTitle>
                    <p className="text-3xl font-bold">
                      {reportCountsLoading ? 'Loading...' : reportCountsData?.countReportsByStatus[status as keyof ReportStatusSummary] ?? 0}
                    </p>
                  </div>
                  <div className={`${className} w-12 h-12 rounded-full flex flex-row items-center justify-center`}>
                    <StatusIcon className="w-8 h-8 text-white" />
                  </div>
                </CardContent>
              </Card>
            )
          })
        }
      </div>
    </>
  );
}