import { useParams } from 'react-router-dom'
import ProfilePage from '@/assets/profile/ProfilePage'

export default function UserProfile() {

  const { username } = useParams()

  return <ProfilePage username={username} />
}