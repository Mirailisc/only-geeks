import { useAppSelector } from '@/hooks/useAppSelector'

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth)

  return <div>{JSON.stringify(user, null, 2)}</div>
}
