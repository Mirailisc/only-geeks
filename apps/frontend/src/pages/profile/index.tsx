import AuthNavbar from '@/components/utils/AuthNavbar'
import { GET_MY_PROFILE_QUERY } from '@/graphql/profile'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import UpdateProfileForm from '@/components/Profile/UpdateProfileForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TerminalIcon } from 'lucide-react'

export interface Profile {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  bio: string
  picture: string
  location: string
  organization: string
  isAdmin: boolean
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const { user } = useAppSelector((state) => state.auth)

  const { data, loading, error } = useQuery<{ getMyProfile: Profile }>(GET_MY_PROFILE_QUERY)

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data) {
      setProfile(data.getMyProfile)
    }
  }, [data])

  if (loading || !user) return <div>Loading...</div>

  return (
    <>
      <AuthNavbar />
      <div className='container mx-auto'>
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Update your preference and profile info.</p>
        </div>
        {user.isAdmin && 
          <Alert variant={"destructive"} className='justify-start'>
            <TerminalIcon />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Now you login as an Admin, So be careful with the changes you make.
            </AlertDescription>
          </Alert>
        }
        {/* <div>{JSON.stringify(profile, null, 2)}</div> */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            {/* <h4>Login as {profile ? profile.email : "Unknown"}</h4> */}
            {profile && <UpdateProfileForm profile={profile} setProfile={setProfile} />}
          </TabsContent>
          <TabsContent value="appearance">Appearance</TabsContent>
        </Tabs>
      </div>
    </>
  )
}
