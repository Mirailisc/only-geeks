import { GET_MY_PROFILE_QUERY, UPDATE_PREFERENCE_MUTATION, type Preference, type Profile } from '@/graphql/profile'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { MonitorIcon, MoonIcon, SunIcon, TriangleAlertIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useMutation } from '@apollo/client/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useTheme } from 'next-themes'

interface AppearanceSettingsProps {
  profile: Profile
}

const AppearanceSettings = ({profile}: AppearanceSettingsProps) => {
  const [updateAppearance, { loading: updating, error: updateError }] = useMutation<{ updatePreference: Preference }>(
    UPDATE_PREFERENCE_MUTATION,
  )
  const { setTheme } = useTheme()
	const updateAppearanceSetting = (theme: "LIGHT" | "DARK" | "SYSTEM") => {
    setTheme(theme.toLowerCase() as 'light' | 'dark' | 'system')
		updateAppearance({
			variables: { input: { currentTheme: theme } },
			refetchQueries: [GET_MY_PROFILE_QUERY],
		})
	}
  return (
    <Card>
      <CardContent>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Customize the look and feel of your profile and dashboard.</CardDescription>
        <Separator className='my-4' />
				{
					updateError && <Alert	variant='destructive' className='mb-4'>
						<TriangleAlertIcon />
            <div className="flex-1">
						  <AlertTitle>Error updating appearance settings</AlertTitle>
						  <AlertDescription>{updateError.message}</AlertDescription>
            </div>
					</Alert>
				}
				<div className='mt-4 w-full h-[1px]' />
        <Label>Application Theme</Label>
				<div className='mt-1 w-full h-[1px]' />
        <ButtonGroup>
          <Button type="button" disabled={updating} variant={profile.preference.currentTheme == "LIGHT" ? "default" : "outline"} onClick={() => updateAppearanceSetting("LIGHT")}><SunIcon /> Light Mode</Button>
          <Button type="button" disabled={updating} variant={profile.preference.currentTheme == "DARK" ? "default" : "outline"} onClick={() => updateAppearanceSetting("DARK")}><MoonIcon /> Dark Mode</Button>
          <Button type="button" disabled={updating} variant={profile.preference.currentTheme == "SYSTEM" ? "default" : "outline"} onClick={() => updateAppearanceSetting("SYSTEM")}><MonitorIcon /> System</Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  )
}

export default AppearanceSettings