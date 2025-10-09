import React, { useState } from 'react'
import { Calendar, Code, Globe, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// --- TYPE DEFINITIONS ---

// 1. Type สำหรับข้อมูล Project แต่ละรายการ
interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  date: string
  imageUrl: string
  codeUrl: string
  liveUrl: string
}

// 2. Type สำหรับ Props ของ ProjectCard
interface ProjectCardProps {
  project: Project
}

// --- MOCK DATA ---

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform built with React and Node.js, featuring secure payment processing.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    date: '1/1/2024',
    imageUrl: 'https://placehold.co/400x300/e0f2fe/0c4a6e?text=E-commerce',
    codeUrl: '#',
    liveUrl: '#',
  },
  {
    id: 2,
    title: 'AI Chatbot Interface',
    description:
      'A responsive web interface for interacting with various LLM APIs, built with Next.js and Tailwind CSS.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    date: '3/15/2024',
    imageUrl: 'https://placehold.co/400x300/f0f9ff/0369a1?text=AI+Chat',
    codeUrl: '#',
    liveUrl: '#',
  },
  {
    id: 3,
    title: 'Real-time Stock Tracker',
    description: 'Application tracking real-time stock data using WebSockets and visualizing trends with D3.js.',
    technologies: ['React', 'WebSockets', 'D3.js', 'Firebase'],
    date: '6/20/2024',
    imageUrl: 'https://placehold.co/400x300/f0f9ff/075985?text=Stock+Tracker',
    codeUrl: '#',
    liveUrl: '#',
  },
]

// Component for a single project card
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Function to handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = 'https://placehold.co/400x300/cccccc/333333?text=Project+Image'
  }

  // Helper for Technology Tags
  const TechTag: React.FC<{ name: string }> = ({ name }) => (
    <span className="inline-flex items-center rounded-full border bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
      {name}
    </span>
  )

  return (
    <Card className="mb-6 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardContent className="p-6 pb-0">
        <div className="flex h-full flex-col items-stretch gap-6 md:flex-row">
          {/* LEFT: Project Details */}
          <div className="flex flex-1 flex-col justify-between">
            {/* Top Part */}
            <div>
              <CardTitle className="mb-2 text-2xl font-bold leading-snug">{project.title}</CardTitle>
              <p className="mb-4 text-base text-gray-600">{project.description}</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <TechTag key={tech} name={tech} />
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <Code className="mr-2 h-4 w-4" /> Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <Globe className="mr-2 h-4 w-4" /> Live
                </Button>
              </div>
              <span className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-1.5 h-4 w-4 text-blue-500" />
                {project.date}
              </span>
            </div>
          </div>

          {/* RIGHT: Image + Edit/Delete */}
          <div className="flex w-full flex-col justify-between md:w-56">
            {/* Image */}
            <div className="mb-4 h-40 w-full overflow-hidden rounded-xl shadow-lg">
              <img
                src={project.imageUrl}
                alt={`Image for ${project.title}`}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            </div>

            {/* Edit/Delete Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <Pencil className="mr-1 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" className="rounded-lg bg-red-600 text-white hover:bg-red-700">
                <Trash2 className="mr-1 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main container component
const ProfileProjects: React.FC = () => {
  const [projects] = useState<Project[]>(MOCK_PROJECTS)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Projects Header and Action Button */}
        <div className="mb-8 flex items-center justify-between px-4 pt-6 sm:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Projects</h1>
          <Button
            className="rounded-lg bg-gray-900 text-white shadow-md hover:bg-gray-700"
            onClick={() => {
              // console.log('Opening add new project editor')
            }}
          >
            <span className="mr-2 text-xl">+</span> Add new
          </Button>
        </div>

        {/* List of Projects */}
        <div className="space-y-6 px-4 py-4 sm:px-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileProjects
