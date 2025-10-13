// import React, { useState } from 'react'
import { CalendarIcon, PencilIcon } from 'lucide-react'
// import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { CREATE_BLOG } from '@/constants/routes'
import { GET_BLOGS_BY_USERNAME_QUERY, GET_MY_BLOGS_QUERY, type Blog } from '@/graphql/blog'
import { useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '../ui/card'
import { dateFormatter } from '@/lib/utils'

// // Component for a single blog post card
const BlogPostCard = ({ post }: { post: Blog }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6 pb-1">
        <div className="flex flex-col items-stretch gap-6 md:flex-row">
          <div className="order-2 flex flex-1 flex-col justify-between md:order-1">
            <div>
              <CardTitle className="mb-2 text-2xl font-bold leading-snug">{post.title}</CardTitle>
              <p className="mb-4 text-base text-gray-600">{post.description}</p>
            </div>

            {/* Bottom: Date */}
            <p className="mt-4 flex items-center self-start text-sm text-gray-500">
              <CalendarIcon className="mr-1.5 h-4 w-4 text-blue-500" />
              {dateFormatter(post.createdAt)}
            </p>
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

            {/* Read more button */}
            <Button
              className=""
              onClick={() => {
                // console.log(`Reading post: ${post.title}`)
              }}
            >
              Read more
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main container component
const ProfileBlog = ({ myEmail, viewEmail }: {myEmail: string | undefined, viewEmail: string | undefined}) => {
  const [BlogPosts, setBlogPosts] = useState<Blog[]>([])
  // const { data, loading, error } = useQuery<{ getMyBlogs: Blog[] }>(GET_MY_BLOGS_QUERY)
  // if myEmail is match with viewEmail then show blog of GET_MY_BLOGS_QUERY else show blog of GET_BLOGS_BY_USERNAME_QUERY

  // select all attributes but not content
  const { data, error } = useQuery<{ getBlogsByUsername?: Blog[], getMyBlogs?: Blog[] }>(myEmail == viewEmail ? GET_MY_BLOGS_QUERY : GET_BLOGS_BY_USERNAME_QUERY, {
    variables: {
      email: viewEmail,
    },
    
    skip: !viewEmail || !myEmail,
  })

  useEffect(() => {
      if (!error && data) {
        if (myEmail == viewEmail) setBlogPosts(data.getMyBlogs || [])
        else setBlogPosts(data.getBlogsByUsername || [])
      }
  }, [data, error, myEmail, viewEmail])

  // console.log('BlogPosts:', BlogPosts)
  if(!myEmail || !viewEmail) return null;

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Blog Header and Action Button */}
        <div className="mb-8 flex items-center justify-between px-4 pt-6 sm:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Blog Posts</h1>
          {/* Write Posts Button*/}
          <Link to={CREATE_BLOG}>
            <Button className="bg-gray-900 text-white hover:bg-gray-700">
              <PencilIcon /> Write blog
            </Button>
          </Link>
        </div>

        {/* List of Blog Posts */}
        <div className="space-y-6 px-4 py-4 sm:px-8">
          {BlogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileBlog
