import { CREATE_MODERATION_DECISION, DEACTIVATE_USER, GET_ALL_AUDIT_LOGS, GET_ALL_DEACTIVATED_USERS, GET_REPORTS_BY_STATUS_OR_ALL, MARK_MODERATION_DECISION_AS_NOT_RESPONDED, UPDATE_MODERATION_DECISION, UPDATE_REPORT_STATUS } from "@/graphql/admin";
import { REPORT_STATUS_TEXT, ReportStatusList, type Report, type ReportStatus } from '@/graphql/report';
import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { Alert, AlertButton, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MODERATION_ACTIONS_TEXT } from "@/constants/report";
import { toast } from "sonner";
import { CheckCircleIcon, FileTextIcon, SearchIcon, UserPenIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const ReportsTab = () => {
  // State for decision modal
  const [searchTerm, setSearchTerm] = useState('');
  // Set initial filter status to 'ALL' to fetch all reports by default
  const [filterStatus, setFilterStatus] = useState<ReportStatus>("ALL");

  // Queries
  // Use the new/renamed query and pass the filterStatus as a variable
  const {
    data: reportsData,
    loading: reportsLoading,
    refetch: refetchReports,
  } = useQuery<{ getAllReportsByStatus: Report[] }>(GET_REPORTS_BY_STATUS_OR_ALL, {
    variables: { status: filterStatus },
    fetchPolicy: 'network-only',
    // Ensure the data field name matches the query: getAllReportsByStatus
  });
  const [createDecision] = useMutation(CREATE_MODERATION_DECISION);
  const [updateDecision] = useMutation(UPDATE_MODERATION_DECISION);
  const [markAsNotResponse] = useMutation(MARK_MODERATION_DECISION_AS_NOT_RESPONDED);
  const [deactivateUser] = useMutation(DEACTIVATE_USER);
  const [updateReportStatus] = useMutation(UPDATE_REPORT_STATUS);
  // const { data: deactivatedUsersData, loading: deactivatedUsersLoading, refetch: refetchDeactivated } = useQuery<{getAllDeactivatedUsers: Partial<Profile>[]}>(GET_ALL_DEACTIVATED_USERS);
  const filteredReports = useMemo(() => {
    // Access the reports data using the correct field name from the query
    const reports = reportsData?.getAllReportsByStatus || [];
    return reports.filter((report) => {
      const matchesSearch =
        report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporter?.username?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filtering is now handled by the GraphQL query, 
      // so we only need to check the search term here.
      return matchesSearch;
    });
  }, [reportsData, searchTerm]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [decisionAction, setDecisionAction] = useState('');
  const [decisionNote, setDecisionNote] = useState('');
  // Function to handle status change and refetch
  const handleStatusChange = (newStatus: string) => {
    // Cast the string to ReportStatus enum for the query variable
    setFilterStatus(newStatus as ReportStatus);
    // refetchReports will be called automatically by useQuery hook 
    // when filterStatus state changes, triggering a new query.
  }

  const handleCreateDecision = async (reportId: string) => {
    try {
      await createDecision({
        variables: {
          input: {
            reportId,
            action: decisionAction,
            note: decisionNote
          }
        }
      });
      if (decisionAction === "DEACTIVATE" && selectedReport?.targetType === "USER" && selectedReport.userReport) {
        try {
          await deactivateUser({
            variables: {
              userId: selectedReport.userReport.target.id,
              reason: `Deactivated due to report: ${decisionNote || 'No reason provided'}`
            },
            refetchQueries: [GET_ALL_DEACTIVATED_USERS, GET_ALL_AUDIT_LOGS]
          });
          toast.success('User deactivated successfully.');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to deactivate user:', error);
          toast.error('Failed to deactivate user.');
        }
      }
      await refetchReports();
      setSelectedReport(null);
      setDecisionAction('');
      setDecisionNote('');
      toast.success('Decision created successfully.'); // Added toast
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Moderation decision already exists for this report") {
          try{
            updateDecision({
              variables: {
                updateModerationDecisionId: selectedReport?.decision?.id || '',
                action: decisionAction,
                note: decisionNote
              },
              refetchQueries: [{ query: GET_REPORTS_BY_STATUS_OR_ALL, variables: { status: filterStatus } }]
            });
            toast.success('Updated existing decision successfully.'); // Added toast
            if (decisionAction === "DEACTIVATE" && selectedReport?.targetType === "USER" && selectedReport.userReport) {
              try {
                await deactivateUser({
                  variables: {
                    userId: selectedReport.userReport.target.id,
                    reason: `Deactivated due to report: ${decisionNote || 'No reason provided'}`
                  },
                  refetchQueries: [GET_ALL_DEACTIVATED_USERS]
                });
                toast.success('User deactivated successfully.');
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to deactivate user:', error);
                toast.error('Failed to deactivate user.');
              }
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error updating decision:', error);
            toast.error('Failed to update existing decision.'); // Added toast
          }
        } else {
          toast.error('Failed to create decision.'); // Added toast
        }
      } else {
        // console.error('Error creating decision:', error);
        toast.error('Failed to create decision.'); // Added toast
      }
    }
  }

  const markAsResolved = async (decisionId: string | undefined) => {
    try{
      if (!decisionId) {
        toast.error('No decision found to mark as resolved.');
        return;
      }
      await updateDecision({
        variables: {
          updateModerationDecisionId: decisionId || '',
          action: "RESOLVED",
          note: 'Marked as resolved by admin.'
        },
        refetchQueries: [{ query: GET_REPORTS_BY_STATUS_OR_ALL, variables: { status: filterStatus } }]
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error marking as resolved:', error);
      toast.error('Failed to mark as resolved.'); // Added toast
    }
  }

  const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
    try {
      await updateReportStatus({
        variables: { id: reportId, status }
      });
      await refetchReports();
      toast.success(`Report status updated to ${status}.`); // Added toast
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating status:', error);
      toast.error('Failed to update report status.'); // Added toast
    }
  }

  const handleMarkAsNotResponse = async (decisionId: string | undefined) => {
    try {
      if (!decisionId) {
        toast.error('No decision found to mark as not responded.');
        return;
      }
      await markAsNotResponse({
        variables: { id: decisionId },
        refetchQueries: [{ query: GET_REPORTS_BY_STATUS_OR_ALL, variables: { status: filterStatus } }]
      });
      toast.success('Marked as not responded successfully.');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error marking as not responded:', error);
      toast.error('Failed to mark as not responded.');
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileTextIcon className="h-8 w-8" /> Reports Management
        </h1>
        <p className="text-gray-600 mt-2">
          Review and manage user reports submitted on the platform.
        </p>
      </div>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label>Search Reports</Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by reason or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-48">
          <Label>Filter by Status</Label>
          <Select value={filterStatus} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {
                ReportStatusList.map((status: ReportStatus) => (
                  <SelectItem key={status} value={status}>{REPORT_STATUS_TEXT[status]}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>

      {reportsLoading ? (
        <div className="text-center py-8">Loading reports...</div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.length == 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileTextIcon />
                </EmptyMedia>
                <EmptyTitle>No &ldquo;{filterStatus}&rdquo; Report</EmptyTitle>
                <EmptyDescription>
                  There are currently no reports with the status &ldquo;{filterStatus}&rdquo;.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : filteredReports.map((report) => (
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
                        {
                          report.decision && report.decision.isResponse &&
                          <AlertButton variant={"destructive"} onClick={()=>{
                            handleMarkAsNotResponse(report.decision?.id)
                          }}>
                            Mark as not response
                          </AlertButton>
                        }
                      </Alert>
                    )}
                  </div>
                  <div className="flex gap-2 flex-col w-48">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedReport(report)}>
                          Take Action
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Moderation Decision</DialogTitle>
                          <DialogDescription>
                            Review and take action on this report
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Action</Label>
                            <Select value={decisionAction} onValueChange={setDecisionAction}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NONE">No action taken</SelectItem>
                                {report.targetType !== 'USER' && <SelectItem value="REQUEST_EDIT">Request Edit</SelectItem>}
                                {report.targetType !== 'USER' && <SelectItem value="UNPUBLISH">Unpublish</SelectItem>}
                                {report.targetType !== 'USER' && <SelectItem value="DELETE">Delete Content</SelectItem>}
                                {report.targetType === 'USER' && <SelectItem value="DEACTIVATE">Deactivate User</SelectItem>}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Note</Label>
                            <Textarea
                              value={decisionNote}
                              onChange={(e) => setDecisionNote(e.target.value)}
                              placeholder="Add a note explaining your decision..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => handleCreateDecision(report.id)}>
                            Submit Decision
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Select
                      value={report.status}
                      onValueChange={(status: ReportStatus) => handleUpdateStatus(report.id, status)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={'PENDING'}>Pending</SelectItem>
                        <SelectItem value={'UNDER_REVIEW'}>Under Review</SelectItem>
                        <SelectItem value={'REQUEST_EDIT'}>Request Edit</SelectItem>
                        <SelectItem value={'RESOLVED'}>Resolved</SelectItem>
                        <SelectItem value={'REJECTED'}>Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          {
                            report.targetType === 'BLOG' && report.blogReport && (
                              <>
                                <h3 className="font-semibold">Blog Report</h3>
                                <p><strong>Title:</strong> {report.blogReport.target.title}</p>
                                <p><strong>Description:</strong> {report.blogReport.target.description}</p>
                                <p><strong>Author:</strong> {report.blogReport.target.User?.firstName} {report.blogReport.target.User?.lastName} ({report.blogReport.target.User?.username})</p>
                              </>
                            )
                          }
                          {
                            report.targetType === 'PROJECT' && report.projectReport && (
                              <>
                                <h3 className="font-semibold">Project Report</h3>
                                <p><strong>Title:</strong> {report.projectReport.target.title}</p>
                                <p><strong>Description:</strong> {report.projectReport.target.description}</p>
                                <p><strong>Author:</strong> {report.projectReport.target.User?.firstName} {report.projectReport.target.User?.lastName} ({report.projectReport.target.User?.username})</p>
                              </>
                            )
                          }
                          {
                            report.targetType === 'USER' && report.userReport && (
                              <>
                                <h3 className="font-semibold">User Report</h3>
                                <p><strong>Username:</strong> {report.userReport.target.username}</p>
                                <p><strong>Name:</strong> {report.userReport.target.firstName} {report.userReport.target.lastName}</p>
                                <p><strong>Email:</strong> {report.userReport.target.email}</p>
                              </>
                            )
                          }
                          <p><strong>Reason: </strong> {report.reason}</p>
                          <p><strong>Reporter: </strong> {report.reporter?.username}</p>
                          <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {
                      report.decision && (
                        (report.decision.action === "REQUEST_EDIT" || 
                        report.decision.action === "UNPUBLISH") && (
                          report.decision.isResponse
                        ) ? (
                          <Button variant={'outline'} onClick={()=>{
                            markAsResolved(report?.decision?.id);
                          }}>
                            Remove {report.decision.action === "REQUEST_EDIT" ? 'edit' : 'unpublish'} request
                          </Button>
                        ) : null
                      )
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};