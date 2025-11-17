import { GET_ALL_AUDIT_LOGS, type AdminAuditLog } from "@/graphql/admin";
import { useQuery } from "@apollo/client/react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { FileTextIcon } from "lucide-react";

// Audit Logs Tab
export const AuditLogsTab = () => {
  const { data: auditLogsData, loading: auditLogsLoading } = useQuery<{getAllAuditLogs: AdminAuditLog[]}>(GET_ALL_AUDIT_LOGS);
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileTextIcon className="h-8 w-8" /> Audit Logs
        </h1>
        <p className="text-gray-600 mt-2">
          View all audit logs on the platform
        </p>
      </div>
      {auditLogsLoading ? (
        <div className="text-center">Loading audit logs...</div>
      ) : (
        <div className="grid gap-4">
        {auditLogsData?.getAllAuditLogs?.map((log) => (
          <Card key={log.id}>
            <CardContent>
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