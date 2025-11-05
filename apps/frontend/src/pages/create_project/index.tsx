import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
  GET_MY_PROJECTS_QUERY_EDITING,
  GET_MY_PROJECTS_QUERY,
} from '@/graphql/project'
import type { Project } from '@/graphql/project'
// import { useAppSelector } from '@/hooks/useAppSelector';
import AuthNavbar from '@/components/utils/AuthNavbar'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import Meta from '@/components/utils/metadata'

interface ProjectFormValues {
  title: string
  description: string
  link: string
  startDate: string
  endDate: string
}

interface ProjectFormProps {
  project?: Project
  onSubmit: (values: Partial<Project>) => void
  loading: boolean
}

function ProjectForm({ project, onSubmit, loading }: ProjectFormProps) {
  const [thumbnail, setThumbnail] = useState((project?.photos && project.photos[0]) || '')
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      link: project?.link || '',
      startDate: project?.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : '',
      endDate: project?.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : '',
    },
    mode: 'onBlur',
  })

  // When parent provides a project (edit mode), reset the form values
  useEffect(() => {
    if (!project) return
    form.reset({
      title: project.title || '',
      description: project.description || '',
      link: project.link || '',
      startDate: project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : '',
    })
    setThumbnail(project.photos?.[0] || '')
  }, [project, form])

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('uploadType', '0')
      const response = await fetch('https://up.m1r.ai/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      setThumbnail(data.url)
    } catch (error) {
      toast.error('Failed to upload image', {
        description: (error as Error).message,
        duration: 5000,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (values: ProjectFormValues) => {
    onSubmit({
      title: values.title,
      description: values.description,
      link: values.link,
      photos: thumbnail ? [thumbnail] : [],
      startDate: values.startDate ? new Date(values.startDate).toISOString() : undefined,
      endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
    })
  }

  return (
    <Form {...form}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{project ? 'Edit your project' : 'Create your new project'}</h1>
        <Button
          type="button"
          className={`inline-flex items-center rounded-md px-4 py-2 text-white ${loading || isUploading ? 'bg-gray-400' : 'bg-black'}`}
          disabled={loading || isUploading}
          onClick={() => form.handleSubmit(handleSubmit)()}
          data-cy="submit"
        >
          <Send />
          {loading && project && 'Updating...'}
          {loading && !project && 'Publishing...'}
          {!loading && project && 'Edit'}
          {!loading && !project && 'Publish'}
        </Button>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="rounded-md border border-black/10 p-4">
        <h2 className="font-bold">Show off what you do</h2>
        <p className="mb-6 text-muted-foreground">Share, show off what you do on the past.</p>
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4">
            <FormLabel>Project Thumbnail</FormLabel>
            <div className="relative">
              <img
                src={thumbnail || 'https://placehold.co/400x300/cccccc/333333?text=Project+Image'}
                alt={thumbnail ? 'Project Thumbnail' : 'Placeholder thumbnail'}
                className="h-[150px] w-[250px] rounded-md border bg-gray-100 object-cover"
              />
              <input id="file-input" type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
            </div>
            <Button type="button" onClick={() => document.getElementById('file-input')?.click()} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Change Thumbnail'}
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Project name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Name" {...field} data-cy="input-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project Description" {...field} required data-cy="input-description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project link</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://yourproject.com" {...field} data-cy="input-link" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-cy="input-startDate" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-cy="input-endDate" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default function CreateOrEditProjectPage() {
  const navigate = useNavigate()
  // const { user } = useAppSelector((state) => state.auth);
  const [editId, setEditId] = useState<string | null>(null)
  const [project, setProject] = useState<Project | undefined>(undefined)
  const { data } = useQuery<{ getMyProjects: Project[] }>(GET_MY_PROJECTS_QUERY_EDITING)
  const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT_MUTATION)
  const [updateProject, { loading: updating }] = useMutation(UPDATE_PROJECT_MUTATION)

  useEffect(() => {
    // Example: get editId from URL search params
    const params = new URLSearchParams(window.location.search)
    const id = params.get('editid')
    setEditId(id)
    if (id && data?.getMyProjects) {
      const found = data.getMyProjects.find((p: Project) => p.id === id)
      if (found) setProject(found)
    }
  }, [data])

  const handleSubmit = async (values: Partial<Project>) => {
    try {
      if (editId && project) {
        const res = await updateProject({
          variables: {
            updateProjectId: editId,
            input: {
              title: values.title,
              description: values.description,
              link: values.link,
              photos: values.photos,
              startDate: values.startDate,
              endDate: values.endDate,
            },
          },
          refetchQueries: [{ query: GET_MY_PROJECTS_QUERY_EDITING }, { query: GET_MY_PROJECTS_QUERY }],
          awaitRefetchQueries: true,
        })
        // update local project state with returned data when available
        const updated = (res as unknown as { data?: { updateProject?: Project } })?.data?.updateProject
        if (updated) setProject(updated)
        toast.success('Project updated successfully!')
        navigate('/profile')
      } else {
        const res = await createProject({
          variables: {
            input: {
              title: values.title,
              description: values.description,
              link: values.link,
              photos: values.photos,
              startDate: values.startDate,
              endDate: values.endDate,
            },
          },
          refetchQueries: [{ query: GET_MY_PROJECTS_QUERY_EDITING }, { query: GET_MY_PROJECTS_QUERY }],
          awaitRefetchQueries: true,
        })
        const added = (res as unknown as { data?: { addProject?: Project } })?.data?.addProject
        if (added) setProject(added)
        toast.success('Project created successfully!')
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Failed to save project', {
        description: error instanceof Error ? error.message : 'Unknown error',
        duration: 5000,
      })
    }
  }

  return (
    <>
      <Meta
        title={editId ? 'Edit Project | Only Geeks' : 'Create Project | Only Geeks'}
        description={editId ? 'Edit your project details on Only Geeks.' : 'Create a new project to showcase on Only Geeks.'}
        keywords={editId ? 'edit project, only geeks' : 'create project, only geeks'}
        image=""
        url={window.location.href}
      />
      <AuthNavbar />
      <div className="container mx-auto py-4">
        <ProjectForm project={project} onSubmit={handleSubmit} loading={creating || updating} />
      </div>
    </>
  )
}
