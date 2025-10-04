import React, { useState } from 'react';
import { Calendar, Code, Globe, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- TYPE DEFINITIONS ---

// 1. Type สำหรับข้อมูล Project แต่ละรายการ
interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  date: string;
  imageUrl: string;
  codeUrl: string;
  liveUrl: string;
}

// 2. Type สำหรับ Props ของ ProjectCard
interface ProjectCardProps {
  project: Project;
}

// --- MOCK DATA ---

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce platform built with React and Node.js, featuring secure payment processing.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    date: "1/1/2024",
    imageUrl: "https://placehold.co/400x300/e0f2fe/0c4a6e?text=E-commerce",
    codeUrl: "#",
    liveUrl: "#",
  },
  {
    id: 2,
    title: "AI Chatbot Interface",
    description: "A responsive web interface for interacting with various LLM APIs, built with Next.js and Tailwind CSS.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    date: "3/15/2024",
    imageUrl: "https://placehold.co/400x300/f0f9ff/0369a1?text=AI+Chat",
    codeUrl: "#",
    liveUrl: "#",
  },
  {
    id: 3,
    title: "Real-time Stock Tracker",
    description: "Application tracking real-time stock data using WebSockets and visualizing trends with D3.js.",
    technologies: ["React", "WebSockets", "D3.js", "Firebase"],
    date: "6/20/2024",
    imageUrl: "https://placehold.co/400x300/f0f9ff/075985?text=Stock+Tracker",
    codeUrl: "#",
    liveUrl: "#",
  },
];

// Component for a single project card
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  // Function to handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://placehold.co/400x300/cccccc/333333?text=Project+Image';
  };

  // Helper for Technology Tags
  const TechTag: React.FC<{ name: string }> = ({ name }) => (
    <span className="inline-flex items-center rounded-full border bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
      {name}
    </span>
  );

  return (
    <Card className="mb-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6 pb-0">
        <div className="flex flex-col md:flex-row gap-6 items-stretch h-full">
          
          {/* LEFT: Project Details */}
          <div className="flex-1 flex flex-col justify-between">
            
            {/* Top Part */}
            <div>
              <CardTitle className="text-2xl font-bold mb-2 leading-snug">
                {project.title}
              </CardTitle>
              <p className="text-gray-600 mb-4 text-base">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <TechTag key={tech} name={tech} />
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="rounded-lg text-gray-700 border-gray-300 hover:bg-gray-100">
                  <Code className="w-4 h-4 mr-2" /> Code
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg text-gray-700 border-gray-300 hover:bg-gray-100">
                  <Globe className="w-4 h-4 mr-2" /> Live
                </Button>
              </div>
              <span className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-blue-500" />
                {project.date}
              </span>
            </div>
          </div>

          {/* RIGHT: Image + Edit/Delete */}
          <div className="w-full md:w-56 flex flex-col justify-between">
            
            {/* Image */}
            <div className="w-full h-40 rounded-xl overflow-hidden shadow-lg mb-4">
              <img
                src={project.imageUrl}
                alt={`Image for ${project.title}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            
            {/* Edit/Delete Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" className="rounded-lg text-gray-700 border-gray-300 hover:bg-gray-100">
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main container component
const ProfileProjects: React.FC = () => {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        
        {/* Projects Header and Action Button */}
        <div className="flex justify-between items-center mb-8 pt-6 px-4 sm:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Projects
          </h1>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-700 rounded-lg shadow-md" 
            onClick={() => { console.log("Opening add new project editor") }}
          >
            <span className="text-xl mr-2">+</span> Add new
          </Button>
        </div>

        {/* List of Projects */}
        <div className="space-y-6 px-4 sm:px-8 py-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileProjects;
