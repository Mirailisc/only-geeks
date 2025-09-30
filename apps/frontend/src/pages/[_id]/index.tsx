import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Profile } from '../profile'
import { useQuery } from '@apollo/client/react'
import { GET_PROFILE_BY_USER_ID_QUERY } from '@/graphql/profile'
import { toast } from 'sonner'
import AuthNavbar from '@/components/utils/AuthNavbar'

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)

  const { userId } = useParams()

  const { data, loading, error } = useQuery<{ getProfileByUserId: Profile }>(GET_PROFILE_BY_USER_ID_QUERY, {
    variables: {
      id: userId,
    },
    skip: !userId,
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data) {
      setProfile(data.getProfileByUserId)
    }
  }, [data])

  if (!userId) return <div>Not Found</div>
  if (loading) return <div>Loading...</div>

  return (
    <div>
      <AuthNavbar />
      <div>{JSON.stringify(profile, null, 2)}</div>
    </div>
  )
}
