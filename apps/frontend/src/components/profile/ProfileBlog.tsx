// import React, { useState } from 'react'
import { CalendarIcon, PencilIcon, Trash2Icon } from 'lucide-react'
// import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { CREATE_BLOG_PATH } from '@/constants/routes'
import { DELETE_BLOG_MUTATION, GET_BLOGS_BY_USERNAME_QUERY, GET_MY_BLOGS_QUERY, type Blog } from '@/graphql/blog'
import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '../ui/card'
import { dateFormatter } from '@/lib/utils'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ui/dialog'
import { Badge } from '../ui/badge'

// // Component for a single blog post card
const BlogPostCard = ({ post, isMyProfile, username }: { post: Blog, isMyProfile: boolean, username:string }) => {
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
            <Button variant="outline" onClick={() => setPromptMeDelete(false)} disabled={loading}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              deleteBlogById({ variables: { blogId: post.id } })
              setPromptMeDelete(false)
            }} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className={`mb-6 ${post.isPublished ? '' : 'opacity-70'}`}>
        <CardContent>
          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            <div className="order-2 flex flex-1 flex-col justify-between md:order-1">
              <div>
                <CardTitle className="mb-2 text-2xl font-bold leading-snug">{post.title}</CardTitle>
                <p className="mb-4 text-base text-gray-600">{post.description}</p>
              </div>

              <div className='flex flex-row gap-2 items-end'>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <CalendarIcon className="mr-1.5 h-4 w-4 text-blue-500" />
                {dateFormatter(post.createdAt)}
              </div>
              {isMyProfile &&<div className=''>
                <Badge variant={post.isPublished ? "default" : "destructive"} className='text-xs'> {post.isPublished ? 'Published' : 'Draft'} </Badge>
              </div>}
              </div>
            </div>

            <div className={
              `order-1 flex w-full flex-shrink-0 flex-col ${post.thumbnail ? "justify-center" : "justify-end"} md:order-2 md:w-56`
            }>
              {/* Image */}
              {post.thumbnail && <div className="mb-4 h-40 w-full overflow-hidden rounded-xl">
                <img
                  src={post.thumbnail}
                  alt={`Image for ${post.title}`}
                  className="h-full w-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = post.thumbnail ?? ''
                  }}
                />
              </div>}
              
              {
                isMyProfile ? (
                  <div className="flex flex-row gap-2 justify-end">
                    <Button variant={"secondary"} disabled={loading} className="" onClick={() => {
                      navigator(`/create/blog/?editid=${post.id}`)
                    }}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant={"destructive"} disabled={loading} className="" onClick={() => { 
                      setPromptMeDelete(true)
                    }}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                    <Button className="" disabled={loading} onClick={() => {
                      if(post.isPublished){
                        navigator(`/blog/${username}/${post.slug}`)
                      }else{
                        navigator(`/create/blog/?editid=${post.id}`)
                      }
                    }}>
                      {post.isPublished ? 'Read More' : 'Edit Draft'}
                    </Button>
                  </div>
                ) : 
                (
                  <div className='flex flex-row gap-2 justify-end'>
                    <Button className="" disabled={loading} onClick={() => {
                      if(post.isPublished){
                        navigator(`/blog/${username}/${post.slug}`)
                      }else{
                        navigator(`/create/blog/?editid=${post.id}`)
                      }
                    }}>
                      {post.isPublished ? 'Read More' : 'Edit Draft'}
                    </Button>
                  </div>
                )
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Main container component
const ProfileBlog = ({ myUsername, viewUsername }: {myUsername: string | undefined, viewUsername: string | undefined}) => {
  const [BlogPosts, setBlogPosts] = useState<Blog[]>([])
  const { data, error } = useQuery<{ getBlogsByUsername?: Blog[], getMyBlogs?: Blog[] }>(myUsername == viewUsername ? GET_MY_BLOGS_QUERY : GET_BLOGS_BY_USERNAME_QUERY, {
    variables: {
      username: viewUsername,
    },
    skip: !viewUsername || !myUsername,
  })

  useEffect(() => {
      if (!error && data) {
        if (myUsername == viewUsername) setBlogPosts(data.getMyBlogs || [])
        else setBlogPosts(data.getBlogsByUsername || [])
      }
  }, [data, error, myUsername, viewUsername])

  if(!myUsername || !viewUsername) return null;

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Blog Header and Action Button */}
        <div className="mb-8 flex items-center justify-between px-4 pt-6 sm:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Blog Posts</h1>
          {/* Write Posts Button*/}
          <Link to={CREATE_BLOG_PATH}>
            <Button className="bg-gray-900 text-white hover:bg-gray-700">
              <PencilIcon /> Write blog
            </Button>
          </Link>
        </div>

        {/* List of Blog Posts */}
        <div className="space-y-6 px-4 py-4 sm:px-8">
          {BlogPosts.map((post) => (
            <BlogPostCard isMyProfile={myUsername === viewUsername} username={viewUsername} key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileBlog
