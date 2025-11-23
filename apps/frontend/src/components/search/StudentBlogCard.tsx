import type { Search } from '@/graphql/search'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StudentBlogCard({ blog }: { blog: Search['blogs'][0] }) {
  return (
    <Link to={`/blogs/${blog.slug}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-lg">
        <CardContent>
          <CardHeader>
            <CardTitle>{blog.title}</CardTitle>
            <CardDescription>By User: {blog.User.username}</CardDescription>
          </CardHeader>
          <CardFooter>
            <CalendarIcon />
            <div className="text-sm text-muted-foreground">
              Created at: {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  )
}
