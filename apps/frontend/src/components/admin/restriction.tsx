import { CREATE_USER_RESTRICTION, GET_ALL_USER_RESTRICTIONS, REMOVE_USER_RESTRICTION, type UserRestriction } from "@/graphql/admin";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader,CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClockIcon } from "lucide-react";

export const RestrictionsTab = () => {

  const { data: restrictionsData, loading: restrictionsLoading, refetch: refetchRestrictions } = useQuery<{ getAllUserRestrictions: UserRestriction[] }>(GET_ALL_USER_RESTRICTIONS);
  // Mutations
  const [createRestriction] = useMutation(CREATE_USER_RESTRICTION);
  const [removeRestriction] = useMutation(REMOVE_USER_RESTRICTION);

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
      toast.success('Restriction created successfully.');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating restriction:', error);
      toast.error('Failed to create restriction.');
    }
  };

  const handleRemoveRestriction = async (id: string) => {
    try {
      await removeRestriction({ variables: { id } });
      await refetchRestrictions();
      toast.success('Restriction removed successfully.');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error removing restriction:', error);
      toast.error('Failed to remove restriction.');
    }
  };

  return (
    <div className="space-y-4">
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
                <SelectItem value="TEMP_BAN">Temporary Ban</SelectItem>
                <SelectItem value="NO_POSTING">No Posting</SelectItem>
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
                            <ClockIcon className="h-3 w-3 mr-1" />
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
