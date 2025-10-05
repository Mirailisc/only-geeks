import React, { useState } from 'react';
import { Calendar, Code, Globe, Pencil, PlusIcon, Trash2 } from 'lucide-react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '../ui/badge';

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

interface ProjectCardProps {
  project: Project;
}

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

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://placehold.co/400x300/cccccc/333333?text=Project+Image';
  };

  const TechTag: React.FC<{ name: string }> = ({ name }) => (
    <Badge variant="outline">{name}</Badge>
  );

  return (
    <Card className="mb-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6 pb-0">
        <div className="flex flex-col md:flex-row gap-6 items-stretch h-full">
          
          <div className="flex-1 flex flex-col justify-between">
            
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

          <div className="w-full md:w-56 flex flex-col justify-between">
            <div className="w-full h-40 rounded-xl overflow-hidden shadow-lg mb-4">
              <img
                src={project.imageUrl}
                alt={`Image for ${project.title}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            
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

export default function ProfileProjects () {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);

  return (
    <div className="min-h-screen">
      <div className="w-full">
        
        <div className="flex justify-between items-center pt-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Projects
          </h1>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-700 rounded-lg shadow-md" 
            onClick={() => {  }}
            variant={"default"}
            size={"sm"}
          >
            <PlusIcon /> Add project
          </Button>
        </div>

        <div className="space-y-6 pt-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
