import LogoutButton from '@/components/utils/LogoutButton'
import { useAppSelector } from '@/hooks/useAppSelector'

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div>
      <div>{JSON.stringify(user, null, 2)}</div>
      <LogoutButton />
    </div>
  )
}
