import React, { useState, useEffect } from 'react'
import { Search, FileText, Clock, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Blog {
  id: number
  title: string
  summary: string
  authorName: string
  authorUsername: string
  authorImageUrl: string
  date: string
  readingTime: string
  views: number
  tags: string[]
}

interface SearchResult {
  blogs: Blog[]
}

const MOCK_RESULTS: SearchResult = {
  blogs: [
    {
      id: 1,
      title: 'Getting Started with React Hooks',
      summary: 'Learn the fundamentals of React Hooks and how they can simplify your component logic.',
      authorName: 'John Doe',
      authorUsername: 'johndoe',
      authorImageUrl: 'https://placehold.co/40x40/fbcfe8/be185d?text=JD',
      date: '1/15/2024',
      readingTime: '5 min read',
      views: 1200,
      tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
    },
    {
      id: 2,
      title: 'Deep Dive into Tailwind CSS Grid System',
      summary:
        'Explore advanced techniques for building complex, responsive layouts using Tailwind CSS Grid utilities.',
      authorName: 'Jane Doe',
      authorUsername: 'janedoe',
      authorImageUrl: 'https://placehold.co/40x40/dbeafe/1e40af?text=JaD',
      date: '1/10/2024',
      readingTime: '8 min read',
      views: 850,
      tags: ['Tailwind', 'CSS', 'Design', 'Frontend'],
    },
  ],
}

// --- Component: Blog Card ---
const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => (
  <a href="#" className="block">
    <Card className="group flex flex-col rounded-lg border border-gray-200 p-5 transition-shadow duration-300">
      {/* Author Info */}
      <div className="mb-3 flex items-center">
        <img src={blog.authorImageUrl} alt={blog.authorName} className="mr-3 h-8 w-8 rounded-full border" />
        <div>
          <p className="text-sm font-medium leading-none text-gray-800 transition-colors group-hover:text-blue-600">
            {blog.authorName}
          </p>
          <p className="text-xs leading-none text-gray-500">@{blog.authorUsername}</p>
        </div>
      </div>

      {/* Title and Summary */}
      <div className="mb-4">
        <h3 className="text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-700">
          {blog.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-700">{blog.summary}</p>
      </div>

      {/* Tags and Metadata */}
      <div className="mt-auto flex flex-col justify-between sm:flex-row sm:items-center">
        <div className="mb-2 flex flex-wrap items-center sm:mb-0">
          {blog.tags.map((tag, index) => (
            <Badge key={index} className="mx-1">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>{blog.readingTime}</span>
          </div>
        </div>
      </div>
    </Card>
  </a>
)

// --- MAIN COMPONENT ---
const BlogSearchResults: React.FC = () => {
  const [results, setResults] = useState<SearchResult>({ blogs: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  // Simulated Data Fetch
  useEffect(() => {
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      try {
        const filtered = MOCK_RESULTS.blogs.filter((blog) =>
          blog.title.toLowerCase().includes(searchKeyword.toLowerCase()),
        )
        setResults({ blogs: filtered })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Failed to fetch search results. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchKeyword])

  const blogCount = results.blogs.length
  const totalResults = blogCount

  const renderBlogSection = () => {
    if (loading) {
      return (
        <div className="mb-10">
          <div className="mb-4 flex items-center text-xl font-bold text-gray-700">
            <FileText className="mr-2 h-5 w-5" />
            Blog Posts (...)
          </div>
          <div className="flex flex-col space-y-4">
            <Card className="h-40 animate-pulse rounded-lg border-gray-200 bg-gray-100 p-5"></Card>
            <Card className="h-40 animate-pulse rounded-lg border-gray-200 bg-gray-100 p-5"></Card>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="mb-10">
          <div className="mb-4 flex items-center text-xl font-bold text-red-600">
            <Search className="mr-2 h-5 w-5" />
            Search Error
          </div>
          <Card className="border border-red-200 bg-red-50 py-10 text-center shadow-sm">
            <p className="font-medium text-red-700">{error}</p>
            <Button className="mt-4 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
              Retry Search
            </Button>
          </Card>
        </div>
      )
    }

    return (
      <div className="mb-10">
        <div className="mb-4 flex items-center text-xl font-bold text-gray-700">
          <FileText className="mr-2 h-5 w-5" />
          Blog Posts ({blogCount})
        </div>
        {blogCount > 0 ? (
          <div className="flex flex-col space-y-4">
            {results.blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <Card className="py-10 text-center">
            <p className="text-gray-500">No blogs found for &quot;{searchKeyword}&quot;.</p>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 ">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">OnlyGeeks - Blog Search</h1>
          <p className="text-base text-gray-500">Find blog posts</p>
        </div>

        <div className="mb-12 flex items-center justify-center">
          <div className="flex w-full max-w-lg overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
            <div className="flex items-center border-r bg-white p-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search blogs..."
              className="flex-1 px-4 py-3 text-lg text-gray-700 focus:outline-none"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)} 
            />
            <Button className="h-auto rounded-l-none bg-gray-900 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800">
              Search
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Search Results for &quot;{searchKeyword}&quot; ({loading ? '...' : totalResults} results)
          </h2>
        </div>

        {renderBlogSection()}
      </div>
    </div>
  )
}

export default BlogSearchResults
