import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Post {
  id: number
  title: string
  summary: string
  date: string
  imageUrl: string
}

interface BlogPostCardProps {
  post: Post
}

const MOCK_BLOG_POSTS: Post[] = [
  {
    id: 1,
    title: 'Getting Started with React Hooks',
    summary: 'Learn the fundamentals of React Hooks and how they can simplify your component logic.',
    date: '1/1/2024',
    imageUrl: 'https://placehold.co/400x300/e0f2fe/0c4a6e?text=Mock+Image', // Placeholder image URL
  },
  {
    id: 2,
    title: 'Understanding Tailwind CSS Utility-First',
    summary: 'A deep dive into why the utility-first approach revolutionizes modern web development workflows.',
    date: '3/15/2024',
    imageUrl: 'https://placehold.co/400x300/f0f9ff/0369a1?text=Tailwind+CSS',
  },
  {
    id: 3,
    title: 'The Power of Monorepos with pnpm',
    summary:
      'Explore how monorepos and pnpm workspaces streamline large-scale project management and dependency handling.',
    date: '6/20/2024',
    imageUrl: 'https://placehold.co/400x300/f0f9ff/075985?text=Monorepo+Setup',
  },
]

// Component for a single blog post card
const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6 pb-1">
        <div className="flex flex-col items-stretch gap-6 md:flex-row">
          {/* LEFT: Text Area  */}
          <div className="order-2 flex flex-1 flex-col justify-between md:order-1">
            {/* Top: Title + Summary */}
            <div>
              <CardTitle className="mb-2 text-2xl font-bold leading-snug">{post.title}</CardTitle>
              <p className="mb-4 text-base text-gray-600">{post.summary}</p>
            </div>

            {/* Bottom: Date */}
            <p className="mt-4 flex items-center self-start text-sm text-gray-500">
              <Calendar className="mr-1.5 h-4 w-4 text-blue-500" />
              {post.date}
            </p>
          </div>

          <div className="order-1 flex w-full flex-shrink-0 flex-col justify-between md:order-2 md:w-56">
            {/* Image */}
            <div className="mb-4 h-40 w-full overflow-hidden rounded-xl">
              <img
                src={post.imageUrl}
                alt={`Image for ${post.title}`}
                className="h-full w-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = 'https://placehold.co/400x300/cccccc/333333?text=Error'
                }}
              />
            </div>

            {/* Read more button */}
            <Button
              className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200"
              onClick={() => {
                console.log(`Reading post: ${post.title}`)
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
const ProfileBlog: React.FC = () => {
  const [posts] = useState<Post[]>(MOCK_BLOG_POSTS)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Blog Header and Action Button */}
        <div className="mb-8 flex items-center justify-between px-4 pt-4 sm:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Blog Posts</h1>
          {/* Write Posts Button*/}
          <Button
            className="bg-gray-900 py-6 text-white hover:bg-gray-700"
            onClick={() => {
              console.log('Opening post editor')
            }}
          >
            Write Posts
          </Button>
        </div>

        {/* List of Blog Posts */}
        <div className="space-y-6 px-4 py-4 sm:px-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileBlog
