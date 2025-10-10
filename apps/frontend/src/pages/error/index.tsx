import { useRouteError, isRouteErrorResponse } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ErrorElement() {
  const error = useRouteError()

  let title = "Oops!"
  let message = "Something went wrong."

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = error.data?.message || "Page not found."
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="outline" asChild>
            <a href="/">Go Home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}