import React, { useState } from 'react'
import { Search, FileText, User, Clock, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'


const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-blue-50/70 px-3 py-1 text-xs font-medium text-blue-700 mr-2 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
        {children}
    </span>
);


// --- TYPE DEFINITIONS ---

// 1. Types สำหรับข้อมูล Blog
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
    tags: string[] // Added tags array
}

// 2. Types สำหรับผลการค้นหา (เฉพาะ Blogs)
interface SearchResult {
    blogs: Blog[]
}

// --- MOCK DATA ---

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
            summary: 'Explore advanced techniques for building complex, responsive layouts using Tailwind CSS Grid utilities.',
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

// Component Blog Card (Horizontal Layout)
const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => (
    <Card className="flex flex-col border-gray-200 p-5 rounded-lg transition-shadow duration-300 hover:shadow-md">
        {/* Author Info */}
        <div className="flex items-center mb-3">
            <img src={blog.authorImageUrl} alt={blog.authorName} className="mr-3 h-8 w-8 rounded-full border" />
            <div>
                <p className="text-sm font-medium text-gray-800 leading-none">{blog.authorName}</p>
                <p className="text-xs text-gray-500 leading-none">@{blog.authorUsername}</p>
            </div>
        </div>

        {/* Title and Summary */}
        <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug">
                {blog.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">{blog.summary}</p>
        </div>

        {/* Tags (now Badges) and Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto">
            {/* Tags/Badges */}
            <div className="flex flex-wrap items-center mb-2 sm:mb-0">
                {blog.tags.map((tag, index) => (
                    <Badge key={index}>{tag}</Badge> // *** ใช้ Badge แทน Tag ***
                ))}
            </div>

            {/* Date and Reading Time */}
            <div className="flex items-center text-xs text-gray-500 space-x-4">
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
)

// --- MAIN COMPONENT ---

const BlogSearchResults: React.FC = () => {
    const [results] = useState<SearchResult>(MOCK_RESULTS)

    const totalResults = results.blogs.length
    const blogCount = results.blogs.length

    const searchKeyword = 'React' // Mocking the search term based on the image

    // Function to render the list of Blog Cards
    const renderBlogSection = () => (
        <div className="mb-10">
            <div className="mb-4 flex items-center text-xl font-bold text-gray-700">
                <FileText className="mr-2 h-5 w-5" />
                Blog Posts ({blogCount})
            </div>
            {blogCount > 0 ? (
                // Changed to simple vertical stacking (space-y-4) instead of a grid
                <div className="flex flex-col space-y-4"> 
                    {results.blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <Card className="py-10 text-center">
                    <p className="text-gray-500">No blogs found for "{searchKeyword}".</p>
                </Card>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-[Inter]">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                
                {/* Top Header and Search Bar */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">OnlyGeeks - Search</h1>
                    <p className="text-base text-gray-500">Find students, projects, and blog posts</p>
                </div>

                {/* Search Input Group */}
                <div className="mb-12 flex items-center justify-center">
                    <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm w-full max-w-lg">
                        <div className="flex items-center border-r bg-white p-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="React" // Mocking the keyword from the image
                            className="flex-1 px-4 py-3 text-lg text-gray-700 focus:outline-none"
                            value={searchKeyword}
                            readOnly
                        />
                        <Button className="h-auto rounded-l-none bg-gray-900 text-white font-semibold hover:bg-gray-800 px-6 py-3 transition-all">Search</Button>
                    </div>
                </div>
                
                {/* Search Results Summary */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Search Results for "{searchKeyword}" ({totalResults} results)
                    </h2>
                </div>

                {/* --- Tabs / Filters Section (Simplified for Blog-only view) --- */}
                <div className="mb-8 flex items-center space-x-2">
                    <div className="px-4 py-2 text-sm font-medium rounded-lg text-gray-500 border border-transparent">
                        All ({totalResults}) 
                    </div>
                    <div className="px-4 py-2 text-sm font-medium rounded-lg text-gray-500 border border-transparent">
                        Students (0)
                    </div>
                    {/* The active "Blogs" tab */}
                    <div className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-900 transition-colors">
                        Blogs ({blogCount})
                    </div>
                </div>

                {/* Blog Results Section */}
                {renderBlogSection()}
            </div>
        </div>
    )
}

export default BlogSearchResults