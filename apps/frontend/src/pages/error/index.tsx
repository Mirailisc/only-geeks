import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Meta from '@/components/utils/metadata'

export default function ErrorElement() {
  const error = useRouteError()

  let title = 'Oops!'
  let message = 'Something went wrong.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = error.data?.message || 'Page not found.'
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <>
      <Meta
        title="Error | Only Geeks"
        description="An error occurred while trying to load the page."
        keywords="error, only geeks"
        image=""
        url={window.location.href}
      />
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" asChild>
              <a href="/profile">Go to my profile</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
