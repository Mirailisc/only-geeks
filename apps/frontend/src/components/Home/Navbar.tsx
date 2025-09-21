import { Button } from '../ui/button'
import { gql } from '@apollo/client'
import { useLazyQuery } from '@apollo/client/react'
import { useEffect } from 'react'
import { toast } from 'sonner'

const GET_GOOGLE_OAUTH_URL = gql`
  query GetGoogleOauthUrl {
    getGoogleOauthUrl
  }
`

interface GetGoogleOauthUrlData {
  getGoogleOauthUrl: string
}

export default function Navbar() {
  const [getUrl, { data, error }] = useLazyQuery<GetGoogleOauthUrlData>(GET_GOOGLE_OAUTH_URL)

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data) {
      window.location.href = data.getGoogleOauthUrl
    }
  }, [data])

  const handleLogin = async () => {
    await getUrl()
  }

  return (
    <div className="sticky left-0 right-0 top-0 z-50 flex flex-row items-center justify-between border-b border-black/10 bg-neutral-100 px-4 py-2">
      <div>
        <div className="text-xl font-bold">Only Geeks</div>
      </div>
      <div>
        <Button variant="default" onClick={handleLogin}>
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
