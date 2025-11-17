import type { Search } from '@/graphql/search'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'

export default function StudentProfileCard({ student }: { student: Search['users'][0] }) {
  return (
    <Link to={`/user/${student.username}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-lg">
        <CardContent>
          {/* Author Info */}
          <div className="flex flex-row gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage className="h-20 w-20" src={student.picture || undefined} alt={student.username} />
              <AvatarFallback className="bg-blue-300">
                {student.firstName[0].toUpperCase()}
                {student.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold text-primary">
                {student.firstName} {student.lastName[0].toUpperCase()}.
              </div>
              <div className="text-lg text-muted-foreground">@{student.username}</div>
              <div className="text-sm text-muted-foreground">{student.bio}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
