import { useParams } from 'react-router-dom'
import ProfilePage from '@/components/profile/ProfilePage'

export default function UserProfile() {

  const { username } = useParams()

  return <ProfilePage username={username} />
}