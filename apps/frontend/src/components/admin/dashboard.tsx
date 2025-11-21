import { GET_RECENT_REPORTS, GET_REPORT_COUNTS_BY_STATUS } from "@/graphql/admin";
import { useQuery } from "@apollo/client/react";
import { CheckCircleIcon, ClockIcon, EditIcon, FileTextIcon, ListChecksIcon, SearchIcon, ShieldCheckIcon, UserPenIcon, XCircleIcon, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { REPORT_STATUS_TEXT, ReportStatusList, type Report, type ReportStatus, type ReportStatusSummary } from "@/graphql/report";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { MODERATION_ACTIONS_TEXT } from "@/constants/report";
import { Button } from "../ui/button";
import type React from "react";
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
  REQUEST_EDIT: { className: "bg-purple-500", icon: EditIcon },
}
export const DashboardTab = ({
  navigator
}: { navigator: React.Dispatch<React.SetStateAction<string>> }) => {
  const {data: reportCountsData, loading: reportCountsLoading} = useQuery<{countReportsByStatus: ReportStatusSummary}>(GET_REPORT_COUNTS_BY_STATUS)
  const {data: recentReportsData, loading: recentReportsLoading} = useQuery<{getRecentReports: Report[]}>(GET_RECENT_REPORTS, {
    variables: { limit: 5 }
  })
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
      <div className={'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4'}>
        {
          ReportStatusList.map((status: ReportStatus) => {
            if(status === "ALL") return;
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
      <div className="my-4 flex flex-row gap-4">
        <h2 className="text-xl font-medium">Recent Reports</h2>
        <Button size={"sm"} onClick={()=>{
          navigator("reports")
        }}>View more</Button>
      </div>
      {
        // eslint-disable-next-line no-nested-ternary
        recentReportsLoading ? (
          <div>Loading recent reports...</div>
        ) : recentReportsData?.getRecentReports.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon />
              </EmptyMedia>
              <EmptyTitle>No Recent Report</EmptyTitle>
              <EmptyDescription>
                There are currently no recent reports to display.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            { 
              recentReportsData?.getRecentReports.map((report) => (
                <Card key={report.id}>
                  <CardContent>
                    <div className="flex justify-between gap-4 items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={report.status === "PENDING" ? 'destructive' : 'default'}>
                            {report.status}
                          </Badge>
                          <Badge variant="secondary">Type: {report.targetType}</Badge>
                          <Badge variant="outline">{report.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Reporter:</strong> {report.reporter?.username || 'Unknown'}
                        </p>
                        <p className="text-sm mb-2"><strong>Reason:</strong> {report.reason}</p>
                        <p className="text-xs text-gray-500">
                          Report at: {new Date(report.createdAt).toLocaleString()}
                        </p>
                        {report.decision && (
                          <Alert className="justify-start my-4" variant={"default"}>
                            <CheckCircleIcon />
                            <div className='flex-1'>
                              <AlertTitle>Decision:&nbsp;{MODERATION_ACTIONS_TEXT[report.decision.action]}</AlertTitle>
                              <AlertDescription>{report.decision.note}</AlertDescription>
                            </div>
                          </Alert>
                        )}
                        {report.decision && (report.decision.action === "REQUEST_EDIT" || report.decision.action === "UNPUBLISH") && (
                          <Alert className="justify-start" variant={"default"}>
                            <UserPenIcon />
                            <div className='flex-1'>
                              <AlertTitle>User response</AlertTitle>
                              <AlertDescription>
                                {
                                  report.decision.isResponse ? (
                                    <span className="text-sm text-green-600 font-medium">
                                      The user has responded to this decision by editing their content at {
                                        new Date(report.decision.updatedAt).toLocaleString()
                                      }
                                    </span>
                                  ) : (
                                    <span className="text-sm text-red-600 font-medium">
                                      Waiting for the user to respond to this decision, now their content is not showing to public.
                                    </span>
                                  )
                                }
                              </AlertDescription>
                            </div>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        )
      }
    </>
  );
}