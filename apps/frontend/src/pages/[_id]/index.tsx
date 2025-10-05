import { useParams } from 'react-router-dom'
import ProfilePage from '@/components/Profile/ProfilePage'

export default function UserProfile() {

  const { username } = useParams()

  return <ProfilePage username={username} />
}
