// import React, { useState } from 'react'
import { CalendarIcon, FileTextIcon, PencilIcon, Trash2Icon } from 'lucide-react'
// import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { CREATE_BLOG_PATH } from '@/constants/routes'
import { DELETE_BLOG_MUTATION, GET_BLOGS_BY_USERNAME_QUERY, GET_MY_BLOGS_QUERY, type Blog } from '@/graphql/blog'
import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { dateFormatter } from '@/lib/utils'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

// // Component for a single blog post card
const BlogblogPostCard = ({ blogPost, isMyProfile, username }: { blogPost: Blog; isMyProfile: boolean; username: string }) => {
  const [deleteBlogById, { loading }] = useMutation<{ deleteBlogById: Blog }>(DELETE_BLOG_MUTATION, {
    refetchQueries: [{ query: GET_MY_BLOGS_QUERY }],
  })
  const [promptMeDelete, setPromptMeDelete] = useState(false)
  const navigator = useNavigate()
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
                deleteBlogById({ variables: { blogId: blogPost.id } })
                setPromptMeDelete(false)
              }}
              disabled={loading}
              data-cy="confirm-delete-blog-button"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className={`mb-6 ${blogPost.isPublished ? '' : 'opacity-70'}`}>
        <CardContent>
          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            <div className="order-2 flex flex-1 flex-col justify-between md:order-1">
              <div>
                <CardTitle className="mb-2 text-2xl font-bold leading-snug">{blogPost.title}</CardTitle>
                <p className="mb-4 text-base text-gray-600">{blogPost.description?.substring(0, 160)}</p>
              </div>

              <div className="flex flex-row items-end gap-2">
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <CalendarIcon className="mr-1.5 h-4 w-4 text-blue-500" />
                  {dateFormatter(blogPost.createdAt)}
                </div>
                {
                  blogPost.requestEdit && isMyProfile && !blogPost.isResponse && (
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
                  blogPost.requestUnpublish && isMyProfile && !blogPost.isResponse && (
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
                  blogPost.isResponse && isMyProfile && (
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
                {!blogPost.requestEdit && !blogPost.requestUnpublish && isMyProfile && (
                  <div className="">
                    <Badge variant={blogPost.isPublished ? 'default' : 'destructive'} className="text-xs">
                      {' '}
                      {blogPost.isPublished ? 'Published' : 'Draft'}{' '}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`order-1 flex w-full flex-shrink-0 flex-col ${blogPost.thumbnail ? 'justify-center' : 'justify-end'} md:order-2 md:w-56`}
            >
              {/* Image */}
              {blogPost.thumbnail && (
                <div className="mb-4 h-40 w-full overflow-hidden rounded-xl">
                  <img
                    src={blogPost.thumbnail}
                    alt={`Image for ${blogPost.title}`}
                    className="h-full w-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = blogPost.thumbnail ?? ''
                    }}
                  />
                </div>
              )}

              {isMyProfile ? (
                <div className="flex flex-row justify-end gap-2">
                  <Button
                    variant={'secondary'}
                    disabled={loading}
                    className=""
                    onClick={() => {
                      navigator(`/create/blog/?editid=${blogPost.id}`)
                    }}
                    data-cy="edit-blog-button"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={'destructive'}
                    disabled={loading}
                    className=""
                    onClick={() => {
                      setPromptMeDelete(true)
                    }}
                    data-cy="delete-blog-button"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                  <Button
                    className=""
                    disabled={loading}
                    onClick={() => {
                      navigator(`/blog/${username}/${blogPost.slug}`)
                    }}
                    data-cy="view-blog-button"
                  >
                    Read More
                  </Button>
                </div>
              ) : (
                <div className="flex flex-row justify-end gap-2">
                  <Button
                    className=""
                    disabled={loading}
                    onClick={() => {
                      navigator(`/blog/${username}/${blogPost.slug}`)
                    }}
                    data-cy="view-blog-button"
                  >
                    Read More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Main container component
const ProfileBlog = ({
  myUsername,
  viewUsername,
}: {
  myUsername: string | undefined
  viewUsername: string | undefined
}) => {
  const [BlogblogPosts, setBlogblogPosts] = useState<Blog[]>([])
  const { data, error } = useQuery<{ getBlogsByUsername?: Blog[]; getMyBlogs?: Blog[] }>(
    myUsername == viewUsername ? GET_MY_BLOGS_QUERY : GET_BLOGS_BY_USERNAME_QUERY,
    {
      variables: {
        username: viewUsername,
      },
      skip: !viewUsername,
    },
  )

  useEffect(() => {
    if (!error && data) {
      if (myUsername == viewUsername) setBlogblogPosts(data.getMyBlogs || [])
      else setBlogblogPosts(data.getBlogsByUsername || [])
    }
  }, [data, error, myUsername, viewUsername])

  if (!viewUsername) return null

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Blog Header and Action Button */}
        <div className="mb-8 flex items-center justify-between px-4 pt-6 sm:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Blog Posts</h1>
          {/* Write blogPosts Button*/}
          {
            myUsername === viewUsername &&
            <Link to={CREATE_BLOG_PATH}>
              <Button variant={"default"}>
                <PencilIcon /> Write blog
              </Button>
            </Link>
          }
        </div>

        {/* List of blog posts */}
        <div className="space-y-6 px-4 py-4 sm:px-8">
          {BlogblogPosts.length > 0 ? BlogblogPosts.map((blogPost) => (
            <BlogblogPostCard isMyProfile={myUsername === viewUsername} username={viewUsername} key={blogPost.id} blogPost={blogPost} />
          )) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileTextIcon />
                </EmptyMedia>
                <EmptyTitle>No Blog yet</EmptyTitle>
                <EmptyDescription>
                  {
                    myUsername === viewUsername
                      ? 'You have not written any blog posts yet. Start sharing your knowledge and experiences with the world!'
                      : 'This user has not written any blog posts yet.'
                  }
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                {myUsername === viewUsername &&
                  <Link to={CREATE_BLOG_PATH}>
                    <Button variant={"default"}><PencilIcon /> Write new blog</Button>
                  </Link>
                }
              </EmptyContent>
            </Empty>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileBlog
