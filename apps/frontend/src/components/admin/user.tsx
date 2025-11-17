import { ACTIVATE_USER, DEACTIVATE_USER, GET_ALL_DEACTIVATED_USERS } from "@/graphql/admin";
import type { Profile } from "@/graphql/profile";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UsersIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "../ui/dialog";
import UserSearchCombobox from "./userFinder";

// User Management Tab
export const UserManagementTab = () => {
  const [deactivateUserId, setDeactivateUserId] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');
  const [activatePromptUserId, setActivatePromptUserId] = useState<string | null>(null);
  const { data: deactivatedUsersData, loading: deactivatedUsersLoading, refetch: refetchDeactivated } = useQuery<{ getAllDeactivatedUsers: Partial<Profile>[] }>(GET_ALL_DEACTIVATED_USERS);
  const [deactivateUser] = useMutation(DEACTIVATE_USER);
  const [activateUser] = useMutation(ACTIVATE_USER);
  const [promptReactivation, setPromptReactivation] = useState<boolean>(false);
  const handleDeactivateUser = async () => {
    try {
      await deactivateUser({
        variables: { userId: deactivateUserId, reason: deactivateReason }
      });
      await refetchDeactivated();
      setDeactivateUserId('');
      setDeactivateReason('');
      toast.success('User deactivated successfully.');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deactivating user:', error);
      toast.error('Failed to deactivate user.');
    }
  }

  const handleActivateUser = (userId: string | undefined) => {
    setActivatePromptUserId(userId || null);
    setPromptReactivation(true);
  }
  const confirmActivateUser = async () => {
    try {
      if (!activatePromptUserId) {
        toast.error('Invalid user ID');
        return;
      }
      await activateUser({ variables: { activatePromptUserId } });
      await refetchDeactivated();
      toast.success('User reactivated successfully.');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error activating user:', error);
      toast.error('Failed to reactivate user.');
    }
  }

  return (
    <>
      <Dialog open={promptReactivation} onOpenChange={()=>{
        setPromptReactivation(false)
        setActivatePromptUserId(null)
      }}>
        <DialogContent>
          <DialogHeader>Are you sure you want to reactivate user?</DialogHeader>
          <DialogDescription>
            This action will restore the user&apos;s access to the platform.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={confirmActivateUser}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="space-y-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UsersIcon className="h-8 w-8" /> User Management
          </h1>
          <p className="text-gray-600 mt-2">
            Activate or deactivate user accounts on the platform
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Deactivate User Account</CardTitle>
            <CardDescription>Temporarily disable user access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User ID</Label>
              <UserSearchCombobox
                placeholder="Search and select user to deactivate"
                value={deactivateUserId}
                setValue={(value)=> setDeactivateUserId(value)}
              />
              {/* <Input
                value={deactivateUserId}
                onChange={(e) => setDeactivateUserId(e.target.value)}
                placeholder="Enter user ID"
              /> */}
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
                  <CardContent>
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
    </>
  );
};