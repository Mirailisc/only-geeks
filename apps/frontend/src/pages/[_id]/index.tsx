import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Profile } from '../profile'
import { useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import AuthNavbar from '@/components/utils/AuthNavbar'
import { GET_PROFILE_BY_USERNAME_QUERY } from '@/graphql/profile'

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

  if (!username) return <div>Not Found</div>
  if (loading) return <div>Loading...</div>

  return (
    <div>
      <AuthNavbar />
      <div>{JSON.stringify(profile, null, 2)}</div>
    </div>
  )
}
