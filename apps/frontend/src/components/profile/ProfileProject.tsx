import React, { useEffect, useState } from 'react'
import { Calendar, CodeIcon, Globe, Pencil, PlusIcon, Trash2 } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  GET_MY_PROJECTS_QUERY,
  DELETE_PROJECT_MUTATION,
  type Project,
  GET_PROJECTS_BY_USERNAME_QUERY,
} from '@/graphql/project'
import { Link, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ui/dialog'
import { CREATE_PROJECT_PATH } from '@/constants/routes'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

// Component for a single project card
const ProjectCard = ({ project, isMyProfile }: { project: Project; isMyProfile: boolean }) => {
  const [deleteProjectById, { loading }] = useMutation<{ deleteProjectById: Project }>(DELETE_PROJECT_MUTATION, {
    refetchQueries: [{ query: GET_MY_PROJECTS_QUERY }],
  })
  const [promptMeDelete, setPromptMeDelete] = useState(false)
  const navigator = useNavigate()

  // Function to handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = project.photos?.[0] ?? 'https://placehold.co/400x300/cccccc/333333?text=Project+Image'
  }

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={promptMeDelete} onOpenChange={setPromptMeDelete}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col gap-4 p-4">
              <h2 className="text-lg font-medium text-gray-900">Are you sure you want to delete this project?</h2>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptMeDelete(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteProjectById({ variables: { deleteProjectId: project.id } })
                setPromptMeDelete(false)
              }}
              disabled={loading}
              data-cy="confirm-delete-project-button"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="mb-6 rounded-xl">
        <CardContent className="p-6 pb-0 pt-0">
          <div className="flex h-full flex-col items-stretch gap-6 md:flex-row">
            {/* LEFT: Project Details */}
            <div className="flex flex-1 flex-col justify-between">
              {/* Top Part */}
              <div>
                <CardTitle className="mb-2 text-2xl font-bold leading-snug">{project.title}</CardTitle>
                <p className="mb-4 text-base text-gray-600">{project.description}</p>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <a href={project.link ?? '#'} target="_blank" rel="noopener noreferrer">
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                      disabled={!project.link}
                      data-cy="project-link-button"
                    >
                      <Globe className="mr-2 h-4 w-4" /> Link
                    </Button>
                  </div>
                </a>

                <span className="flex items-center text-sm text-gray-500">
                  {project.startDate && <Calendar className="mr-1.5 h-4 w-4 text-blue-500" />}
                  {project.startDate && (
                    <>
                      {new Date(project.startDate).toLocaleDateString('en-GB')}
                      {project.endDate && ' - '}
                    </>
                  )}
                  {project.endDate && new Date(project.endDate).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>

            {/* RIGHT: Image + Edit/Delete */}
            <div className="flex w-full flex-col justify-between md:w-56">
              {/* Image */}
              <div className="mb-4 h-40 w-full overflow-hidden rounded-xl">
                <img
                  src={project.photos?.[0] ?? 'https://placehold.co/400x300/cccccc/333333?text=No+Image'}
                  alt={`Image for ${project.title}`}
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              </div>

              {/* Edit/Delete Buttons */}
              {isMyProfile && (
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                    disabled={loading}
                    onClick={() => {
                      navigator(`/create/project/?editid=${project.id}`)
                    }}
                    data-cy="edit-project-button"
                  >
                    <Pencil className="mr-1 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant={'destructive'}
                    disabled={loading}
                    size="sm"
                    className="rounded-lg bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      setPromptMeDelete(true)
                    }}
                    data-cy="delete-project-button"
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Main container component
const ProfileProjects = ({
  myUsername,
  viewUsername,
}: {
  myUsername: string | undefined
  viewUsername: string | undefined
}) => {
  const [projects, setProjects] = useState<Project[]>([])
  const { data, error } = useQuery<{ getProjectsByUsername?: Project[]; getMyProjects?: Project[] }>(
    myUsername === viewUsername ? GET_MY_PROJECTS_QUERY : GET_PROJECTS_BY_USERNAME_QUERY,
    {
      variables: {
        username: viewUsername,
      },
      skip: !viewUsername || !myUsername,
    },
  )

  useEffect(() => {
    if (!error && data) {
      if (myUsername === viewUsername) setProjects(data.getMyProjects || [])
      else setProjects(data.getProjectsByUsername || [])
    }
  }, [data, error, myUsername, viewUsername])

  if (!myUsername || !viewUsername) return null

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Projects Header and Action Button */}
        <div className="mb-8 flex items-center justify-between px-4 pt-6 sm:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Projects</h1>
          {
            myUsername === viewUsername && (
            <Link to={CREATE_PROJECT_PATH}>
              <Button variant={"default"}>
                <PlusIcon /> Add new
              </Button>
            </Link>
            )
          }
        </div>

        {/* List of Projects */}
        <div className="space-y-6 px-4 py-4 sm:px-8">
          {projects.length > 0 ? projects.map((project) => (
            <ProjectCard key={project.id} project={project} isMyProfile={myUsername === viewUsername} />
          )) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CodeIcon />
                </EmptyMedia>
                <EmptyTitle>No Projects yet</EmptyTitle>
                <EmptyDescription>
                  {
                    myUsername === viewUsername
                      ? 'You have not created any projects yet. Start sharing your knowledge and experiences with the world!'
                      : 'This user has not created any projects yet.'
                  }
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                {myUsername === viewUsername &&
                  <Link to={CREATE_PROJECT_PATH}>
                    <div className="flex gap-2">
                      <Button variant={"default"}><PlusIcon /> Add new project</Button>
                    </div>
                  </Link>
                }
              </EmptyContent>
            </Empty>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileProjects
