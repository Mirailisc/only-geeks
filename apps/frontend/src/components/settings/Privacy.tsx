import { GET_MY_PROFILE_QUERY, type Profile, UPDATE_PREFERENCE_MUTATION } from '@/graphql/profile'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { TriangleAlertIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { useMutation } from '@apollo/client/react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Switch } from '../ui/switch'

interface PrivacySettingsProps {
  profile: Profile
}

const PrivacySettings = ({profile}: PrivacySettingsProps) => {
  const [updatePrivacy, { loading: updating, error: updateError }] = useMutation<{ updateProfileInfo: Profile }>(
    UPDATE_PREFERENCE_MUTATION,
  )
	const updatePrivacySetting = (isPublicProfile: boolean) => {
		updatePrivacy({
			variables: { input: { isPublicProfile: isPublicProfile } },
			refetchQueries: [GET_MY_PROFILE_QUERY],
		})
	}
  return (
    <Card>
      <CardContent>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control who can see your profile information.</CardDescription>
        <Separator className='my-4' />
				{
					updateError && <Alert	variant='destructive' className='mb-4'>
						<TriangleAlertIcon />
						<AlertTitle>Error updating Privacy settings</AlertTitle>
						<AlertDescription>{updateError.message}</AlertDescription>
					</Alert>
				}
        <div className='mt-4 w-full h-[1px]' />
        <Label>Profile Visibility</Label>
        <div className='mt-1 w-full h-[1px]' />
        <div className="flex items-center space-x-2">
          <Switch id="profile-visibility" disabled={updating} checked={profile.preference.isPublicProfile} onCheckedChange={updatePrivacySetting} />
          <Label htmlFor="profile-visibility">{profile.preference.isPublicProfile ? "Your profile is public to everyone." : "Your profile is private."}</Label>
        </div>
        {profile.preference.isPublicProfile ?
          <Alert variant={"destructive"} className='mt-4 w-max'>
            <TriangleAlertIcon />
            <AlertTitle className='ml-4 flex items-center gap-2'>
              Important Notice
            </AlertTitle>
            <AlertDescription className='ml-4'>
              Your profile is visible to all users. <br />
              Please be cautious about the personal information you choose to share publicly.
            </AlertDescription>
          </Alert>
        :
          <Alert variant={"destructive"} className='mt-4 w-max'>
            <TriangleAlertIcon />
            <AlertTitle className='ml-4 flex items-center gap-2'>
              Important Notice
            </AlertTitle>
            <AlertDescription className='ml-4'>
              Setting your profile to private will hide your profile information from other users. <br /> 
              However, certain data may still be accessible to administrators for moderation and compliance purposes.
            </AlertDescription>
          </Alert>
        }
      </CardContent>
    </Card>
  )
}

export default PrivacySettings