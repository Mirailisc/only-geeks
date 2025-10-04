import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Profile } from '../profile'
import { useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import AuthNavbar from '@/components/utils/AuthNavbar'
import { GET_PROFILE_BY_USERNAME_QUERY } from '@/graphql/profile'
import { Loading, NotFound } from '@/components/utils/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Building2Icon, MailIcon, MapPinIcon, type LucideIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileBlog from '@/components/Profile/ProfileBlog.tsx'

function DisplayWithIcon ({ icon, text }: { icon:LucideIcon, text: string }) {
  const Icon = icon
  return (
    <div className='flex items-center gap-2 text-muted-foreground px-6'>
      <Icon />
      <span>{text}</span>
    </div>
  )
}

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)

  const { username } = useParams()

  const { data, loading, error } = useQuery<{ getProfileByUsername: Profile }>(GET_PROFILE_BY_USERNAME_QUERY, {
    variables: {
      username: username,
    },
    skip: !username,
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data) {
      setProfile(data.getProfileByUsername)
    }
  }, [data])

  if (!username) return <NotFound text='Please provide a username.' />
  if (!profile && !loading) return <NotFound text='User not found.' description='The user you are looking for does not exist or has been removed.' />
  if (loading) return <Loading />

  return (
    <div>
      <AuthNavbar />
      <div className='container mx-auto flex xl:flex-row flex-col gap-4 mt-10'>
        <Card>
          <CardContent className='flex flex-row xl:flex-col'>
            <Avatar className='w-[240px] h-[240px] xl:w-[368px] xl:h-[368px] mb-4'>
              <AvatarImage src={profile?.picture ? profile.picture.replace("=s96-c","=s400-c") : undefined} alt={profile?.firstName || 'Avatar'} />
              <AvatarFallback className='bg-blue-300'>
                {profile?.firstName[0].toUpperCase()}
                {profile?.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='space-y-4'>
              <CardHeader>
                <CardTitle>
                  <h2 className='text-3xl font-bold'>{profile?.firstName} {profile?.lastName}</h2>
                </CardTitle>
                <CardDescription>
                  <p className='text-lg'>@{profile?.username}</p>
                </CardDescription>
              </CardHeader>
              <div className='px-6'>
                <p className='text-muted-foreground'>{profile?.bio}</p>
              </div>
              <DisplayWithIcon icon={MapPinIcon} text={profile?.location || "Unknown Location"} />
              <DisplayWithIcon icon={Building2Icon} text={profile?.organization || "Unknown Organization"} />
              <DisplayWithIcon icon={MailIcon} text={profile?.email || "Unknown Email"} />
            </div>
            
          </CardContent>
        </Card>
        <Tabs defaultValue="portfolio" className='w-full'>
          <TabsList className='w-full'>
            <TabsTrigger className='w-full' data-cy="portfolio-tab" value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger className='w-full' data-cy="projects-tab" value="projects">Projects</TabsTrigger>
            <TabsTrigger className='w-full' data-cy="blogs-tab" value="blogs">Blogs</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio">This is Portfolio tabs</TabsContent>
          <TabsContent value="projects">This is Projects tabs</TabsContent>
          <TabsContent value="blogs"><ProfileBlog/></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
