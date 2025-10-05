import React, { useState } from 'react'
import { Search, Users, MapPin, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// --- TYPE DEFINITIONS ---

// 1. Types สำหรับข้อมูลนักเรียน/ผู้ใช้
interface Student {
  id: number
  name: string
  username: string
  profileImageUrl: string
  bio: string
  location: string
  university: string
  projectsCount: number
  blogsCount: number
}

// 2. Types สำหรับผลการค้นหา (เฉพาะนักเรียน)
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
      university: 'Krungthep University',
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
      university: 'Chiangmai University',
      projectsCount: 1,
      blogsCount: 1,
    },
  ],
}

// Component Student Card
const StudentCard: React.FC<{ student: Student }> = ({ student }) => (
  <Card className="flex h-full flex-col">
    <div className="mb-4 flex items-center">
      <img src={student.profileImageUrl} alt={student.name} className="mr-3 h-10 w-10 rounded-full border" />
      <div>
        <h3 className="text-base font-semibold text-gray-900">{student.name}</h3>
        <p className="text-sm text-gray-500">@{student.username}</p>
      </div>
    </div>

    <p className="mb-4 text-sm leading-relaxed text-gray-700">{student.bio}</p>

    <div className="mt-auto space-y-2">
      <div className="flex items-center text-sm text-gray-600">
        <Briefcase className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
        <span className="truncate">{student.university}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
        <span className="truncate">{student.location}</span>
      </div>
    </div>

    <div className="mt-4 flex justify-start space-x-6 border-t border-gray-100 pt-4 text-sm font-medium">
      <div className="flex items-center text-gray-600">
        <span className="mr-1 font-bold text-gray-900">{student.projectsCount}</span>
        Projects
      </div>
      <div className="flex items-center text-gray-600">
        <span className="mr-1 font-bold text-gray-900">{student.blogsCount}</span>
        Blogs
      </div>
    </div>
  </Card>
)

// --- MAIN COMPONENT ---

const SearchResults: React.FC = () => {
  const [results] = useState<SearchResult>(MOCK_RESULTS)

  const totalResults = results.students.length
  const studentCount = results.students.length

  const searchKeyword = 'React' // Mocking the search term

  // Function to render the list of Student Cards
  const renderStudentSection = () => (
    <div className="mb-10">
      <div className="mb-4 flex items-center text-xl font-bold text-gray-700">
        <Users className="mr-2 h-5 w-5" />
        Students ({studentCount})
      </div>
      {studentCount > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {results.students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <Card className="py-10 text-center">
          <p className="text-gray-500">No students found for "{searchKeyword}".</p>
        </Card>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-[Inter]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Header and Search Bar */}
        <div className="mb-8 flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">OnlyGeeks - Student Search</h1>
          <p className="text-sm text-gray-500">Find students by skill, university, or location</p>
        </div>

        {/* Search Input Group */}
        <div className="mb-10 flex overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="flex items-center border-r bg-gray-50 p-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by skill, name, or university (e.g., React, John Doe)"
            className="flex-1 px-4 py-3 text-gray-700 focus:outline-none"
            value={searchKeyword}
            readOnly
          />
          <Button className="h-auto rounded-none bg-gray-900 text-white hover:bg-gray-800">Search</Button>
        </div>

        {/* Search Results Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Results for "{searchKeyword}" ({totalResults} students)
          </h2>
        </div>

        {/* Student Results Section */}
        {renderStudentSection()}
      </div>
    </div>
  )
}

export default SearchResults
