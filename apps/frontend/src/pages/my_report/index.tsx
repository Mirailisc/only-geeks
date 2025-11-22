import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, FileText, User, FolderOpen, FileTextIcon } from 'lucide-react';
import { GET_MY_REPORTS, GET_MY_WARNINGS, type ModerationAction, type Report, type ReportStatus } from '@/graphql/report';
import { useQuery } from '@apollo/client/react';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useNavigate } from 'react-router-dom';
import { MY_REPORTS_PATH, MY_WARNING_PATH } from '@/constants/routes';
import AuthNavbar from '@/components/utils/AuthNavbar';

const StatusBadge = ({ status }: {
  status: ReportStatus
}) => {
  if (status === "ALL") return null;
  const variants: Record<ReportStatus, string> = {
    ALL: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    UNDER_REVIEW: 'bg-blue-100 text-blue-800',
    REQUEST_EDIT: 'bg-purple-100 text-purple-800',
    RESOLVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
      {status}
    </Badge>
  );
};

const ActionBadge = ({ action }: {
  action: ModerationAction
}) => {
  const variants = {
    NONE: 'bg-gray-100 text-gray-800',
    REQUEST_EDIT: 'bg-yellow-100 text-yellow-800',
    UNPUBLISH: 'bg-red-100 text-red-800',
    RESOLVED: 'bg-green-100 text-green-800',
    DEACTIVATE: 'bg-red-200 text-red-900',
    DELETE: 'bg-red-300 text-red-950',
  };

  return (
    <Badge className={variants[action] || 'bg-gray-100 text-gray-800'}>
      {action}
    </Badge>
  );
};

const TargetInfo = ({ report }: {
  report: Report
}) => {
  const { targetType, blogReport, projectReport, userReport } = report;

  if (targetType === 'BLOG' && blogReport?.target) {
    return (
      <div className="flex items-start gap-2">
        <FileText className="w-4 h-4 mt-1 text-gray-500" />
        <div>
          <p className="font-medium">{blogReport.target.title}</p>
          {blogReport.target.User && (
            <p className="text-sm text-gray-600">
              by @{blogReport.target.User.username}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (targetType === 'PROJECT' && projectReport?.target) {
    return (
      <div className="flex items-start gap-2">
        <FolderOpen className="w-4 h-4 mt-1 text-gray-500" />
        <div>
          <p className="font-medium">{projectReport.target.title}</p>
          {projectReport.target.User && (
            <p className="text-sm text-gray-600">
              by @{projectReport.target.User.username}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (targetType === 'USER' && userReport?.target) {
    return (
      <div className="flex items-start gap-2">
        <User className="w-4 h-4 mt-1 text-gray-500" />
        <div>
          <p className="font-medium">
            {userReport.target.firstName} {userReport.target.lastName}
          </p>
          <p className="text-sm text-gray-600">@{userReport.target.username}</p>
        </div>
      </div>
    );
  }

  return <p className="text-gray-500">Target not available</p>;
};

const ReportCard = ({ report }: {
  report: Report
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{report.category}</CardTitle>
            <CardDescription>
              {new Date(report.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </div>
          <StatusBadge status={report.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Reported Content</p>
          <TargetInfo report={report} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
          <p className="text-sm text-gray-600">{report.reason}</p>
        </div>

        {report.decision && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Decision:</span>
                  <ActionBadge action={report.decision.action} />
                </div>
                {report.decision.note && (
                  <p className="text-sm">{report.decision.note}</p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(report.decision.createdAt).toLocaleDateString()}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const WarningCard = ({ warning }: {
  warning: Report
}) => {
  return (
    <Card className="border-orange-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-orange-800">{warning.category}</CardTitle>
            <CardDescription>
              {new Date(warning.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </div>
          <StatusBadge status={warning.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Your Content</p>
          <TargetInfo report={warning} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Violation</p>
          <p className="text-sm text-gray-600">{warning.reason}</p>
        </div>

        {warning.adminNote && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="text-sm font-medium mb-1">Admin Note</p>
              <p className="text-sm">{warning.adminNote}</p>
            </AlertDescription>
          </Alert>
        )}

        {warning.decision && (
          <Alert className="border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Action Taken:</span>
                  <ActionBadge action={warning.decision.action} />
                </div>
                {warning.decision.note && (
                  <p className="text-sm">{warning.decision.note}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const ReportTab = () => {
  const { loading, error, data } = useQuery<{
    getMyReports: Report[]
  }>(GET_MY_REPORTS);

  if (loading) return <div className="p-6">Loading your reports...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading reports</div>;

  const reports = data?.getMyReports || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Reports</h1>
        <p className="text-gray-600">Track the status of content you&apos;ve reported</p>
      </div>

      {reports.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>You haven&apos;t submit any reports.</EmptyTitle>
            <EmptyDescription>
              If you encounter any content that violates our guidelines, feel free to report it for review.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
};

const WarningTab = () => {
  const { loading, error, data } = useQuery<{
    getMyWarnings: Report[]
  }>(GET_MY_WARNINGS);

  if (loading) return <div className="p-6">Loading your warnings...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading warnings</div>;

  const warnings = data?.getMyWarnings || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Warnings</h1>
        <p className="text-gray-600">Review warnings and violations on your account</p>
      </div>

      {warnings.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>
              You haven&apos;t received any warnings.
            </EmptyTitle>
            <EmptyDescription>
              Keep up the good work! If you ever have questions about our community guidelines, feel free to reach out.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {warnings.map(warning => (
            <WarningCard key={warning.id} warning={warning} />
          ))}
        </div>
      )}
    </div>
  );
};

// Demo component with tabs to show both pages
export default function MyReportPage({
  currentPage
}: {
  currentPage: 'reports' | 'warnings'
}) {
  const navigate = useNavigate();
  return (
    <>
      <AuthNavbar />
      <div className="h-[1px] w-full my-2" />
      <div className='px-4 container mx-auto'>
        <Tabs defaultValue={currentPage} className="w-full" onValueChange={(page)=>{
          if (page === 'reports') {
            navigate(MY_REPORTS_PATH);
          } else {
            navigate(MY_WARNING_PATH);
          }
        }}>
          
          <TabsList className="w-full">
            <TabsTrigger className="w-full" data-cy="my-report-button" value="reports">My Reports</TabsTrigger>
            <TabsTrigger className="w-full" data-cy="my-warning-button" value="warnings">My Warnings</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-4">
            <ReportTab />
          </TabsContent>

          <TabsContent value="warnings" className="mt-4">
            <WarningTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}