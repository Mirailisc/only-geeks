/* eslint-disable no-console */
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {  
  Shield, 
  Users, 
  FileText, 
  Ban, 
  CheckCircle,
  Clock,
  SearchIcon
} from 'lucide-react';
import {
    GET_ALL_AUDIT_LOGS,
    GET_ALL_DEACTIVATED_USERS,
    GET_ALL_REPORTS,
    GET_ALL_USER_RESTRICTIONS,
    CREATE_MODERATION_DECISION,
    UPDATE_REPORT_STATUS,
    CREATE_USER_RESTRICTION,
    DEACTIVATE_USER,
    ACTIVATE_USER,
    REMOVE_USER_RESTRICTION,
    type UserRestriction,
    type AdminAuditLog
} from '@/graphql/admin';

import type { Report, ReportStatus } from '@/graphql/report';
import type { Profile } from '@/graphql/profile';
import { toast } from 'sonner';
import AuthNavbar from '@/components/utils/AuthNavbar';


const AdminModerationDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Queries
  const { data: reportsData, loading: reportsLoading, refetch: refetchReports } = useQuery<{getAllReports: Report[]}>(GET_ALL_REPORTS);
  const { data: auditLogsData, loading: auditLogsLoading } = useQuery<{getAllAuditLogs: AdminAuditLog[]}>(GET_ALL_AUDIT_LOGS);
  const { data: restrictionsData, loading: restrictionsLoading, refetch: refetchRestrictions } = useQuery<{getAllUserRestrictions: UserRestriction[]}>(GET_ALL_USER_RESTRICTIONS);
  const { data: deactivatedUsersData, loading: deactivatedUsersLoading, refetch: refetchDeactivated } = useQuery<{getAllDeactivatedUsers: Partial<Profile>[]}>(GET_ALL_DEACTIVATED_USERS);

  // Mutations
  const [createDecision] = useMutation(CREATE_MODERATION_DECISION);
  const [updateReportStatus] = useMutation(UPDATE_REPORT_STATUS);
  const [createRestriction] = useMutation(CREATE_USER_RESTRICTION);
  const [deactivateUser] = useMutation(DEACTIVATE_USER);
  const [activateUser] = useMutation(ACTIVATE_USER);
  const [removeRestriction] = useMutation(REMOVE_USER_RESTRICTION);

  // Filter reports
  const filteredReports = reportsData?.getAllReports?.filter((report) => {
    const matchesSearch = report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  // Reports Tab Component
  const ReportsTab = () => {
    // State for decision modal
    const [, setSelectedReport] = useState<Report | null>(null);
    const [decisionAction, setDecisionAction] = useState('');
    const [decisionNote, setDecisionNote] = useState('');

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
        await refetchReports();
        setSelectedReport(null);
        setDecisionAction('');
        setDecisionNote('');
      } catch (error) {
        console.error('Error creating decision:', error);
      }
    };

    const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
      try {
        await updateReportStatus({
          variables: { id: reportId, status }
        });
        await refetchReports();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

    return (
      <div className="space-y-4">
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {reportsLoading ? (
          <div className="text-center py-8">Loading reports...</div>
        ) : (
          <div className="grid gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={report.status === 'PENDING' ? 'destructive' : 'default'}>
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Reporter:</strong> {report.reporter?.username || 'Unknown'}
                      </p>
                      <p className="text-sm mb-2"><strong>Reason:</strong> {report.reason}</p>
                      <p className="text-xs text-gray-500">
                        Reported: {new Date(report.createdAt).toLocaleString()}
                      </p>
                      {report.decision && (
                        <Alert className="mt-3">
                          <CheckCircle className="h-4 w-4" />
                          <AlertTitle>Decision: {report.decision.action}</AlertTitle>
                          <AlertDescription>{report.decision.note}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedReport(report)}>
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
                                  <SelectItem value="approved">Approve</SelectItem>
                                  <SelectItem value="rejected">Reject</SelectItem>
                                  <SelectItem value="warning">Warning</SelectItem>
                                  <SelectItem value="ban">Ban User</SelectItem>
                                  <SelectItem value="content_removed">Remove Content</SelectItem>
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
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
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

  // User Restrictions Tab
  const RestrictionsTab = () => {
    const [userId, setUserId] = useState('');
    const [restrictionType, setRestrictionType] = useState('');
    const [reason, setReason] = useState('');
    const [expiresAt, setExpiresAt] = useState('');

    const handleCreateRestriction = async () => {
      try {
        await createRestriction({
          variables: {
            input: {
              userId,
              type: restrictionType,
              reason,
              expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
            }
          }
        });
        await refetchRestrictions();
        setUserId('');
        setRestrictionType('');
        setReason('');
        setExpiresAt('');
      } catch (error) {
        console.error('Error creating restriction:', error);
      }
    };

    const handleRemoveRestriction = async (id: string) => {
      try {
        await removeRestriction({ variables: { id } });
        await refetchRestrictions();
      } catch (error) {
        console.error('Error removing restriction:', error);
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create User Restriction</CardTitle>
            <CardDescription>Apply restrictions to user accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User ID</Label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
              />
            </div>
            <div>
              <Label>Restriction Type</Label>
              <Select value={restrictionType} onValueChange={setRestrictionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post_ban">Post Ban</SelectItem>
                  <SelectItem value="comment_ban">Comment Ban</SelectItem>
                  <SelectItem value="message_ban">Message Ban</SelectItem>
                  <SelectItem value="full_ban">Full Ban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the reason for this restriction..."
              />
            </div>
            <div>
              <Label>Expires At (Optional)</Label>
              <Input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateRestriction}>Create Restriction</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Restrictions</h3>
          {restrictionsLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid gap-4">
              {restrictionsData?.getAllUserRestrictions?.map((restriction) => (
                <Card key={restriction.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{restriction.type}</Badge>
                          {restriction.expiresAt && (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Expires: {new Date(restriction.expiresAt).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-1">
                          <strong>User:</strong> {restriction.user?.username}
                        </p>
                        <p className="text-sm text-gray-600">{restriction.reason}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Created: {new Date(restriction.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveRestriction(restriction.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // User Management Tab
  const UserManagementTab = () => {
    const [deactivateUserId, setDeactivateUserId] = useState('');
    const [deactivateReason, setDeactivateReason] = useState('');

    const handleDeactivateUser = async () => {
      try {
        await deactivateUser({
          variables: { userId: deactivateUserId, reason: deactivateReason }
        });
        await refetchDeactivated();
        setDeactivateUserId('');
        setDeactivateReason('');
      } catch (error) {
        console.error('Error deactivating user:', error);
      }
    };

    const handleActivateUser = async (userId: string | undefined) => {
      try {
        if (!userId) {
            toast.error('Invalid user ID');
            return;
        }
        await activateUser({ variables: { userId } });
        await refetchDeactivated();
      } catch (error) {
        console.error('Error activating user:', error);
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Deactivate User Account</CardTitle>
            <CardDescription>Temporarily disable user access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User ID</Label>
              <Input
                value={deactivateUserId}
                onChange={(e) => setDeactivateUserId(e.target.value)}
                placeholder="Enter user ID"
              />
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                placeholder="Explain why this account is being deactivated..."
              />
            </div>
            <Button variant="destructive" onClick={handleDeactivateUser}>
              Deactivate User
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Deactivated Users</h3>
          {deactivatedUsersLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid gap-4">
              {deactivatedUsersData?.getAllDeactivatedUsers?.map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-600">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Button onClick={() => handleActivateUser(user.id)}>
                        Reactivate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Audit Logs Tab
  const AuditLogsTab = () => {
    return (
      <div className="space-y-4">
        {auditLogsLoading ? (
          <div className="text-center py-8">Loading audit logs...</div>
        ) : (
          <div className="grid gap-4">
            {auditLogsData?.getAllAuditLogs?.map((log) => (
              <Card key={log.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{log.actionType}</Badge>
                        <Badge variant="outline">{log.targetType}</Badge>
                      </div>
                      <p className="text-sm mb-2">
                        <strong>Admin:</strong> {log.admin?.username || 'Unknown'}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Target ID:</strong> {log.targetId}
                      </p>
                      {log.details && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Details:</strong> {log.details}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
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

  return (
    <>
      <AuthNavbar />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Moderation Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage reports, user restrictions, and monitor platform activity
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="restrictions" className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              Restrictions
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="restrictions" className="mt-6">
            <RestrictionsTab />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagementTab />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AuditLogsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminModerationDashboard;