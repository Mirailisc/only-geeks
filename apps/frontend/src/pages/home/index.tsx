// import Navbar from '@/components/Home/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { GET_GOOGLE_OAUTH_URL } from '@/graphql/auth'
import { useLazyQuery } from '@apollo/client/react'
import { Code2Icon } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface GetGoogleOauthUrlData {
  getGoogleOauthUrl: string
}

export default function Home() {
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary rounded-lg p-3">
              <Code2Icon className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-balance">OnlyGeeks</h1>
          <p className="text-muted-foreground text-lg text-pretty">Share your projects, inspire the community</p>
        </div>

        {/* Login Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-pretty">
              Sign in to showcase your portfolio and connect with fellow students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Separator className="my-4" />

            <p className="text-xs text-center text-muted-foreground text-pretty">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-foreground transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground text-pretty">
            New to OnlyGeeks? Join thousands of students sharing their journey
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Code2Icon className="h-3 w-3" /> Upload Projects
            </span>
            <span>•</span>
            <span>Share Blogs</span>
            <span>•</span>
            <span>Build Portfolio</span>
          </div>
        </div>
      </div>
    </div>
  )
}
