import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import { ME_QUERY, LOGOUT_MUTATION } from '@/graphql/auth'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { setUser, clearUser, type User } from '../../store/authSlice'
import { toast } from 'sonner'
import { Loading } from './loading'
import { useTheme } from 'next-themes'

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
  const { setTheme } = useTheme()
  const isSyncThemeRef = useRef<boolean>(false)
  const [logoutMutation] = useMutation(LOGOUT_MUTATION)

  useEffect(() => {
    const handleLogout = async (showToast = false) => {
      try {
        await logoutMutation()
      } finally {
        dispatch(clearUser())
        if (showToast) {
          toast.error('Session expired. Please log in again.')
        }
      }
    }

    if (!queryLoading) {
      if (data?.me) {
        const preferredTheme = data.me.preferences.currentTheme
        if(!isSyncThemeRef.current){
          isSyncThemeRef.current = true
          // eslint-disable-next-line no-console
          console.log("Preferred Theme:", preferredTheme);
          setTheme(preferredTheme.toLowerCase() as 'light' | 'dark' | 'system')
        }
        dispatch(setUser({ user: data.me, accessToken: '' }))
      } else {
        handleLogout(false)
      }
      setLoading(false)
    }
  }, [data, queryLoading, dispatch, logoutMutation, setTheme])

  useEffect(() => {
    if (error) {
      setLoading(false)
      
      // Check if the error is NO_ACCESS_TOKEN
      const isNoAccessToken = error.message.includes('NO_ACCESS_TOKEN')
      
      // Only show toast if it's NOT a missing token error
      if (!isNoAccessToken) {
        toast.error('Session expired. Please log in again.')
      }
      
      logoutMutation()
        .catch(() => {})
        .finally(() => dispatch(clearUser()))
    }
  }, [error, dispatch, logoutMutation])

  if (queryLoading || loading) return <Loading />

  return <Outlet />
}