import { ArrowRightIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

interface BlogCTAProps {
  author: {
    image: string
    username: string
    firstName: string
    lastName: string
  }
  blogTitle: string
  onCreateClick?: () => void
}

export function BlogCTA({ author, blogTitle, onCreateClick }: BlogCTAProps) {
  return (
    <Card className="border-2 bg-card my-4">
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          {/* Author Info and Blog Title - Left Side */}
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-12 w-12 ring-2 ring-border flex-shrink-0">
              <AvatarImage src={author.image || "/placeholder.svg"} alt={`${author.firstName} ${author.lastName}`} />
              <AvatarFallback className="bg-muted text-base font-semibold">
                {author.firstName[0]}
                {author.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="font-semibold text-foreground truncate">
                {author.firstName} {author.lastName}
              </div>
              <div className="text-sm text-muted-foreground truncate">@{author.username}</div>
              <div className="text-xs text-muted-foreground truncate mt-0.5">&ldquo;{blogTitle}&rdquo;</div>
            </div>
          </div>

          {/* CTA Button - Right Side */}
          <Button onClick={onCreateClick} size="lg" className="w-full sm:w-auto group flex-shrink-0">
            Create your own blog
            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}