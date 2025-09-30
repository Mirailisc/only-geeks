import AuthNavbar from '@/components/utils/AuthNavbar'
import { GET_MY_PROFILE_QUERY } from '@/graphql/profile'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import UpdateProfileForm from '@/components/Profile/UpdateProfileForm'

export interface Profile {
  id: string
  email: string
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
    <div>
      <AuthNavbar />
      <div>{JSON.stringify(profile, null, 2)}</div>
      {user.isAdmin && <div>You are an admin</div>}
      {profile && <UpdateProfileForm profile={profile} setProfile={setProfile} />}
    </div>
  )
}
