import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import { ME_QUERY, LOGOUT_MUTATION } from '@/graphql/auth'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { setUser, clearUser, type User } from '../../store/authSlice'
import { toast } from 'sonner'
import { Loading } from './loading'

export default function Boot() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery<{ me: User }>(ME_QUERY, {
    fetchPolicy: 'network-only',
  })

  const [logoutMutation] = useMutation(LOGOUT_MUTATION)

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutMutation()
      } finally {
        dispatch(clearUser())
        toast.error('Session expired. Please log in again.')
      }
    }

    if (!queryLoading) {
      if (data?.me) {
        dispatch(setUser({ user: data.me, accessToken: '' }))
      } else {
        handleLogout()
      }
      setLoading(false)
    }
  }, [data, queryLoading, dispatch, logoutMutation])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
      setLoading(false)
      logoutMutation()
        .catch(() => {})
        .finally(() => dispatch(clearUser()))
    }
  }, [error, dispatch, logoutMutation])

  if (queryLoading || loading) return <Loading />

  return <Outlet />
}
