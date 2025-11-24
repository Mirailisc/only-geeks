import { Loader2Icon, TriangleAlertIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import AuthNavbar from './AuthNavbar'

const Loading = () => {
  return (
    <>
      <AuthNavbar />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Login Card */}
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-col items-center space-y-4 text-center">
              <Loader2Icon className="animate-spin" size={60} />
              <CardTitle className="text-2xl font-bold">OnlyGeeks is loading...</CardTitle>
              <CardDescription className="text-pretty">Please wait a moment</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  )
}

const NotFound = ({ text, description }: { text?: string; description?: string }) => {
  return (
    <>
      <AuthNavbar />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Login Card */}
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-col items-center space-y-4 text-center">
              <TriangleAlertIcon className="text-destructive" size={60} />
              <CardTitle className="text-2xl font-bold">{text ? text : 'Not found.'}</CardTitle>
              {description && <CardDescription className="text-pretty">{description}</CardDescription>}
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  )
}

export { Loading, NotFound }
