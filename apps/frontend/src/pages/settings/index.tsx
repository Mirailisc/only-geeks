import AuthNavbar from '@/components/utils/AuthNavbar'
import { GET_MY_PROFILE_QUERY, type Profile } from '@/graphql/profile'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import UpdateProfileForm from '@/components/settings/UpdateProfileForm'
import { Alert, AlertButton, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TerminalIcon, TriangleAlertIcon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import { Loading } from '@/components/utils/loading'
import AppearanceSettings from '@/components/settings/Appearance'
import PrivacySettings from '@/components/settings/Privacy'
import Meta from '@/components/utils/metadata'
import { Link, useSearchParams } from 'react-router-dom'
import { ADMIN_DASHBOARD_PATH } from '@/constants/routes'
type PageType = 'profile' | 'appearance' | 'privacy'
export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const { user } = useAppSelector((state) => state.auth)
  const [currentTab, setCurrentTab] = useState<PageType>('profile')
  const { data, loading, error } = useQuery<{ getMyProfile: Profile }>(GET_MY_PROFILE_QUERY)
  const [searchParams] = useSearchParams()
  const errorQuery = searchParams.get('error')
  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data) {
      setProfile(data.getMyProfile)
    }
  }, [data])

  if (loading || !user) return <Loading />

  return (
    <>
      <Meta
        title="Settings | Only Geeks"
        description="Update your profile information and preferences on Only Geeks."
        keywords="settings, profile, appearance, privacy, only geeks"
        image=""
        url={window.location.href}
      />
      <AuthNavbar />
      <div className="container mx-auto">
        <div className="mb-8 mt-4">
          <h1 className="mb-2 text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Update your profile information and preferences.</p>
        </div>
        {
          errorQuery === 'not_admin' && (
            <Alert variant={'destructive'} className="mb-4 justify-start">
              <TriangleAlertIcon />
              <div className="flex-1">
                <AlertTitle>Access Denied!</AlertTitle>
                <AlertDescription>You must be an admin to access the admin page.</AlertDescription>
              </div>
            </Alert>
          )
        }
        {user.isAdmin && (
          <Alert variant={'destructive'} className="mb-4 justify-start">
            <TerminalIcon />
            <div className="flex-1">
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>Now you login as an Admin, So be careful with the changes you make.</AlertDescription>
            </div>
            <Link to={ADMIN_DASHBOARD_PATH}>
              <AlertButton variant={"default"}>Go to Admin Dashboard</AlertButton>
            </Link>
          </Alert>
        )}
        <Tabs defaultValue="profile" onValueChange={(value) => setCurrentTab(value as PageType)} value={currentTab}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-4">
            {profile && <UpdateProfileForm profile={profile} setProfile={setProfile} />}
          </TabsContent>
          <TabsContent value="appearance" className="mt-4">
            {
              profile && <AppearanceSettings profile={profile} />
            }
          </TabsContent>
          <TabsContent value="privacy" className="mt-4">
            {
              profile && <PrivacySettings profile={profile} />
            }
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
