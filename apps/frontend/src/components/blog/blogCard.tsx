import type { Profile } from '@/graphql/profile'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarIcon, ClockIcon, EditIcon, ShareIcon, Trash2Icon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMutation } from '@apollo/client/react'
import { DELETE_BLOG_MUTATION, GET_MY_BLOGS_QUERY, type Blog } from '@/graphql/blog'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import ReportComponentWithButton from '../report/report'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'


function getReadingTime(markdown: string, wordsPerMinute = 200): number {
  // Remove code blocks, HTML tags, and markdown syntax before counting words
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    // eslint-disable-next-line no-useless-escape
    .replace(/[#>*_`~\-\[\]\(\)!]/g, '')
    .trim()

  const wordCount = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return minutes
}

const BlogCard = ({
  user,
  myUsername,
  description,
  title,
  blogId,
  updatedAt,
  content,
  isPublished,
  requestUnpublish,
  requestEdit,
  isResponse,
}: {
  user: Partial<Profile>
  myUsername: string
  description: string
  title: string
  blogId: string
  updatedAt: string
  content: string
  isPublished: boolean
  requestUnpublish?: boolean
  requestEdit?: boolean
  isResponse?: boolean
}) => {
  const [deleteBlogById, { loading }] = useMutation<{ deleteBlogById: Blog }>(DELETE_BLOG_MUTATION, {
    refetchQueries: [{ query: GET_MY_BLOGS_QUERY }],
  })
  const [promptMeDelete, setPromptMeDelete] = useState(false)
  const isMyBlog = myUsername === user.username
  const navigation = useNavigate()
  return (
    <>
      <Dialog open={promptMeDelete} onOpenChange={setPromptMeDelete}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col gap-4 p-4">
              <h2 className="text-lg font-medium text-gray-900">Are you sure you want to delete this blog post?</h2>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptMeDelete(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteBlogById({ variables: { blogId: blogId } })
                setPromptMeDelete(false)
                navigation(`/user/${user.username}`)
              }}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="mt-4">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <div className="text-balance text-3xl font-bold leading-tight">{title}</div>
                {
                  requestEdit && isMyBlog && !isResponse && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="warning" className="mt-1">
                          Admin request to edit this blog
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This blog will be private until admin resolve your request.</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }
                {
                  requestUnpublish && isMyBlog && !isResponse && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="destructive" className="mt-1">
                          Admin request to unpublish this blog
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This blog will be private until admin resolve your request.</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }
                {
                  isResponse && isMyBlog && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="mt-1">
                          This blog already responded to admin request
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Please wait for admin to review your changes. The blog is private until then.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }
                {!requestEdit && !requestUnpublish && isMyBlog && (
                  <Badge variant={isPublished ? 'default' : 'destructive'} className="mt-1 h-max text-xs">
                    {' '}
                    {isPublished ? 'Published' : 'Draft'}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {description.length > 50 ? description.slice(0, 50) + '...' : description}
              </div>
            </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={()=>{
                  const profileUrl = `${window.location.href}`;
                  navigator.clipboard.writeText(profileUrl);
                  toast.success('Blog URL copied to clipboard!');
                }}>
                  <ShareIcon /> Share this Blog
                </Button>
                <ReportComponentWithButton
                  type="BLOG"
                  cybuttonname="report-blog-button"
                  myUsername={myUsername}
                  user={user}
                  targetId={blogId}
                />
                {myUsername === user.username && (
                  <Link to={`/create/blog/?editid=${blogId}`}>
                    <Button variant="outline" size="sm">
                      <EditIcon className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                )}
                {myUsername === user.username && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setPromptMeDelete(true)
                    }}
                  >
                    <Trash2Icon className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Link
              to={`/user/${user.username}`}
              className="flex items-center space-x-3 transition-opacity hover:opacity-80"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.picture || '/placeholder.svg'} alt={user.firstName + `'s profile picture`} />
                <AvatarFallback>
                  {(user.firstName?.[0]?.toUpperCase() ?? '') + (user.lastName?.[0]?.toUpperCase() ?? '') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {new Date(updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {getReadingTime(content, 150)} min read
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BlogCard
