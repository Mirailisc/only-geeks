import React, { useState, useEffect } from 'react'
import { Search, Users, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Student {
  id: number
  name: string
  username: string
  profileImageUrl: string
  bio: string
  location: string
  projectsCount: number
  blogsCount: number
}

interface SearchResult {
  students: Student[]
}

// --- MOCK DATA ---
const MOCK_RESULTS: SearchResult = {
  students: [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      profileImageUrl: 'https://placehold.co/40x40/fbcfe8/be185d?text=JD',
      bio: 'Computer Science student passionate about React web development and AI',
      location: 'Bangkok, Thailand',
      projectsCount: 1,
      blogsCount: 1,
    },
    {
      id: 2,
      name: 'Jane Doe',
      username: 'janedoe',
      profileImageUrl: 'https://placehold.co/40x40/dbeafe/1e40af?text=JaD',
      bio: 'Computer Engineering Student passionate about Cloud computing, React, Node.js and API Backend.',
      location: 'Chiangmai, Thailand',
      projectsCount: 1,
      blogsCount: 1,
    },
  ],
}

// --- COMPONENT: Student Card ---
const StudentCard: React.FC<{ student: Student }> = ({ student }) => (
  <a href="#" className="block h-full">
    <Card className="group flex h-full flex-col rounded-lg border border-gray-200 p-5 transition-shadow duration-300 hover:shadow-md">
      {/* Author Info */}
      <div className="mb-3 flex items-center">
        <img src={student.profileImageUrl} alt={student.name} className="mr-3 h-10 w-10 rounded-full border" />
        <div>
          <p className="text-sm font-medium leading-none text-gray-800 transition-colors group-hover:text-blue-600">
            {student.name}
          </p>
          <p className="text-xs leading-none text-gray-500">@{student.username}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="mb-4 flex-grow text-sm text-gray-700">{student.bio}</p>

      {/* Location */}
      <div className="mb-3 flex items-center text-sm text-gray-600">
        <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
        <span>{student.location}</span>
      </div>

      {/* Footer */}
      <div className="mt-auto flex justify-start space-x-6 border-t border-gray-100 pt-3 text-sm font-medium">
        <div className="flex items-center text-gray-600">
          <span className="mr-1 font-bold text-gray-900">{student.projectsCount}</span> Projects
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-1 font-bold text-gray-900">{student.blogsCount}</span> Blogs
        </div>
      </div>
    </Card>
  </a>
)

// --- MAIN COMPONENT ---
const SearchResults: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [results, setResults] = useState<SearchResult>({ students: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // fetch data
  useEffect(() => {
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      try {
        // Filter mock data
        const filtered = MOCK_RESULTS.students.filter(
          (s) =>
            s.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            s.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            s.bio.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            s.location.toLowerCase().includes(searchKeyword.toLowerCase()),
        )

        setResults({ students: filtered })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Failed to fetch search results.')
      } finally {
        setLoading(false)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [searchKeyword])

  const studentCount = results.students.length

  const renderStudentSection = () => {
    if (loading) {
      return (
        <div className="mb-10">
          <div className="mb-4 flex items-center text-xl font-bold text-gray-700">
            <Users className="mr-2 h-5 w-5" />
            Students (...)
          </div>
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
            <Card className="h-40 animate-pulse rounded-lg border-gray-200 bg-gray-100"></Card>
            <Card className="h-40 animate-pulse rounded-lg border-gray-200 bg-gray-100"></Card>
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
            <Button className="mt-4 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">Retry</Button>
          </Card>
        </div>
      )
    }

    return (
      <div className="mb-10">
        <div className="mb-4 flex items-center text-xl font-bold text-gray-700">
          <Users className="mr-2 h-5 w-5" />
          Students ({studentCount})
        </div>
        {studentCount > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
            {results.students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <Card className="py-10 text-center">
            <p className="text-gray-500">No students found for &quot;{searchKeyword || 'your query'}&quot;.</p>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">OnlyGeeks - Student Search</h1>
          <p className="text-base text-gray-500">Find students by name, university, or location</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 flex items-center justify-center">
          <div className="flex w-full max-w-lg overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
            <div className="flex items-center border-r bg-white p-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, or university or location"
              className="flex-1 px-4 py-3 text-lg text-gray-700 focus:outline-none"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button className="h-auto rounded-l-none bg-gray-900 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800">
              Search
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Search Results for &quot;{searchKeyword || '...'}&quot; ({loading ? '...' : studentCount} students)
          </h2>
        </div>

        {/* Results */}
        {renderStudentSection()}
      </div>
    </div>
  )
}

export default SearchResults
