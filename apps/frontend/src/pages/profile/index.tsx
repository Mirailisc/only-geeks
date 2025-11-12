import { GET_MY_PROFILE_QUERY, type Profile } from '@/graphql/profile'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loading } from '@/components/utils/loading'
import ProfilePage from '@/components/profile/ProfilePage'
import Meta from '@/components/utils/metadata'

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

  if (loading || !user) return <Loading />

  return (
    <>
      <Meta
        title={`${profile?.username}'s Profile | Only Geeks`}
        description={profile?.bio || `Welcome to ${profile?.username}'s profile on Only Geeks.`}
        keywords={`profile, ${profile?.username || ''}, only geeks`}
        image={profile?.picture || ''}
        url={window.location.href}
      />
      <ProfilePage username={profile?.username} />
    </>
  )
}
