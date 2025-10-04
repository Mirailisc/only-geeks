import AuthNavbar from '@/components/utils/AuthNavbar'
import { GET_MY_PROFILE_QUERY } from '@/graphql/profile'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import UpdateProfileForm from '@/components/Profile/UpdateProfileForm'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TerminalIcon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'

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

export default function Settings() {
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
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Update your profile information and preferences.</p>
        </div>
        {user.isAdmin && 
          <Alert variant={"destructive"} className='justify-start mb-4'>
            <TerminalIcon />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Now you login as an Admin, So be careful with the changes you make.
            </AlertDescription>
          </Alert>
        }
        <Tabs defaultValue='profile'>
          <TabsList>
            <TabsTrigger value='profile'>Profile</TabsTrigger>
            <TabsTrigger value='appearance'>Appearance</TabsTrigger>
            <TabsTrigger value='privacy'>Privacy</TabsTrigger>
          </TabsList>
          <TabsContent value='profile' className='mt-4'>
            {profile && <UpdateProfileForm profile={profile} setProfile={setProfile} />}
          </TabsContent>
          <TabsContent value='appearance' className='mt-4'>
            <div className='text-muted-foreground'>Appearance settings will be available soon.</div>
          </TabsContent>
          <TabsContent value='privacy' className='mt-4'>
            <div className='text-muted-foreground'>Privacy settings will be available soon.</div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
