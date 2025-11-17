import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import AuthNavbar from '@/components/utils/AuthNavbar'
import { GET_PROFILE_BY_USERNAME_QUERY, type Profile } from '@/graphql/profile'
import { Loading, NotFound } from '@/components/utils/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Building2Icon, MailIcon, MapPinIcon, ShareIcon, type LucideIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileBlog from '@/components/profile/ProfileBlog'
import ProfileProjects from '@/components/profile/ProfileProject'
import { useAppSelector } from '@/hooks/useAppSelector'
import ProfilePortfolio from './ProfilePortfolio'
import { Button } from '@/components/ui/button'
import Meta from '../utils/metadata'
import ReportComponentWithButton from '../report/report'

function DisplayWithIcon({ icon, text }: { icon: LucideIcon; text: string }) {
  const Icon = icon
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon />
      <span>{text}</span>
    </div>
  )
}
interface ProfilePageProps {
  username: string | undefined
}
export default function ProfilePage({ username }: ProfilePageProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const { user: myUser } = useAppSelector((state) => state.auth)
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

  if (!username) return <NotFound text="Please provide a username." />
  if (!profile && !loading)
    return (
      <NotFound text="User not found." description="The user you are looking for does not exist or has been removed." />
    )
  if (loading) return <Loading />

  return (
    <>
      <Meta
        title={`${profile?.firstName || ''} ${profile?.lastName || ''} (@${profile?.username}) | Only Geeks`}
        description={profile?.bio || `Check out ${profile?.firstName || ''}'s profile on Only Geeks.`}
        keywords={`profile, ${profile?.username || ''}, only geeks`}
        image={profile?.picture || ''}
        url={window.location.href}
      />
      <AuthNavbar />
      <div className="container mx-auto mt-4 flex flex-col gap-6 xl:flex-row">
        <div className="h-max w-full flex-shrink-0 self-start xl:sticky xl:top-20 xl:w-[400px]">
          <Card className="h-max">
            <CardContent className="flex flex-row xl:flex-col">
              <Avatar className="mb-4 h-[240px] w-[240px] xl:h-[350px] xl:w-[350px]">
                <AvatarImage
                  src={profile?.picture ? profile.picture.replace('=s96-c', '=s400-c') : undefined}
                  alt={profile?.firstName || 'Avatar'}
                />
                <AvatarFallback className="bg-blue-300">
                  {profile?.firstName[0].toUpperCase()}
                  {profile?.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4 pl-6">
                <CardHeader className='pl-0'>
                  <CardTitle>
                    <h2 className="text-3xl font-bold">
                      {profile?.firstName} {profile?.lastName}
                    </h2>
                  </CardTitle>
                  <CardDescription>
                    <p className="text-lg">@{profile?.username}</p>
                  </CardDescription>
                </CardHeader>
                <div>
                  <p className="text-muted-foreground">{profile?.bio}</p>
                </div>
                {profile?.location && <DisplayWithIcon icon={MapPinIcon} text={profile.location} />}
                {profile?.organization && <DisplayWithIcon icon={Building2Icon} text={profile.organization} />}
                {profile?.email && <DisplayWithIcon icon={MailIcon} text={profile.email} />}
                <div className='flex flex-row gap-2'>
                  <Button variant={"outline"} size={"sm"} onClick={()=>{
                    const profileUrl = `${window.location.origin}/user/${profile?.username}`;
                    navigator.clipboard.writeText(profileUrl);
                    toast.success('Profile URL copied to clipboard!');
                  }}>
                    <ShareIcon /> Share Profile
                  </Button>
                  {
                    profile && 
                    <ReportComponentWithButton
                      type="USER"
                      myUsername={myUser?.username || ""}
                      user={profile}
                      targetId={profile.id}
                    />
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" data-cy="portfolio-tab" value="portfolio">
              Portfolio
            </TabsTrigger>
            <TabsTrigger className="w-full" data-cy="projects-tab" value="projects">
              Projects
            </TabsTrigger>
            <TabsTrigger className="w-full" data-cy="blogs-tab" value="blogs">
              Blogs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio">
            <ProfilePortfolio viewUsername={username} myUsername={myUser?.username} />
          </TabsContent>
          <TabsContent value="projects">
            <ProfileProjects viewUsername={username} myUsername={myUser?.username} />
          </TabsContent>
          <TabsContent value="blogs">
            <ProfileBlog viewUsername={username} myUsername={myUser?.username} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="h-48 w-full"></div>
    </>
  )
}
