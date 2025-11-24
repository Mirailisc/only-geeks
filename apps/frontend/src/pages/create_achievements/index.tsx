import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import AuthNavbar from '@/components/utils/AuthNavbar'
import Meta from '@/components/utils/metadata'
import {
  CREATE_ACHIEVEMENT_MUTATION,
  GET_MY_ACHIEVEMENTS_QUERY,
  GET_MY_ACHIEVEMENTS_QUERY_EDITING,
  UPDATE_ACHIEVEMENT_MUTATION,
  type Achievement,
} from '@/graphql/achievement'
import { useMutation, useQuery } from '@apollo/client/react'
import { Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface AchievementFormValues {
  title: string
  description: string
  date: string
  issuer: string
}

interface AchievementFormProps {
  achievement?: Achievement
  onSubmit: (values: Partial<Achievement>) => void
  loading: boolean
}

function AchievementForm({ achievement, onSubmit, loading }: AchievementFormProps) {
  const [thumbnail, setThumbnail] = useState((achievement?.photos && achievement.photos[0]) || '')
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<AchievementFormValues>({
    defaultValues: {
      title: achievement?.title || '',
      issuer: achievement?.issuer || '',
      description: achievement?.description || '',
      date: achievement?.date ? new Date(achievement.date).toISOString().slice(0, 10) : '',
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!achievement) return
    form.reset({
      title: achievement.title || '',
      issuer: achievement.issuer || '',
      description: achievement.description || '',
      date: achievement.date ? new Date(achievement.date).toISOString().slice(0, 10) : '',
    })
    setThumbnail((achievement?.photos && achievement.photos[0]) || '')
  }, [achievement, form])

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.')
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

  const handleSubmit = (values: AchievementFormValues) => {
    onSubmit({
      title: values.title,
      issuer: values.issuer,
      description: values.description,
      date: values.date ? new Date(values.date).toISOString() : undefined,
      photos: thumbnail ? [thumbnail] : [],
    })
  }

  return (
    <Form {...form}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{achievement ? 'Edit Achievement' : 'Create Achievement'}</h1>
        <Button
          type="button"
          className={`inline-flex items-center rounded-md px-4 py-2 text-white ${loading || isUploading ? 'bg-gray-400' : 'bg-black'}`}
          disabled={loading || isUploading}
          onClick={() => form.handleSubmit(handleSubmit)()}
          data-cy="submit"
        >
          <Send />
          {loading && achievement && 'Updating...'}
          {loading && !achievement && 'Publishing...'}
          {!loading && achievement && 'Edit'}
          {!loading && !achievement && 'Publish'}
        </Button>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="rounded-md border border-black/10 p-4">
        <h2 className="font-bold">Achievement</h2>
        <p className="mb-6 text-muted-foreground">Share your achievement with others.</p>
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4">
            <FormLabel>Certificate</FormLabel>
            <div className="relative">
              <img
                src={thumbnail || 'https://placehold.co/400x300/cccccc/333333?text=Certificate+image'}
                alt={thumbnail ? 'Certificate Thumbnail' : 'Placeholder thumbnail'}
                className="h-[150px] w-[250px] rounded-md border bg-gray-100 object-cover"
              />
              <input id="file-input" type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
            </div>
            <Button type="button" onClick={() => document.getElementById('file-input')?.click()} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Change Certificate'}
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} data-cy="input-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
                  <FormControl>
                    <Input placeholder="Issuer" {...field} data-cy="input-issuer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-cy="input-date" />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} required data-cy="input-description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}

export default function CreateAchievementsPage() {
  const navigate = useNavigate()
  const [editId, setEditId] = useState<string | null>(null)
  const [achievement, setAchievement] = useState<Achievement | undefined>(undefined)
  const { data } = useQuery<{ getMyAchievements: Achievement[] }>(GET_MY_ACHIEVEMENTS_QUERY_EDITING)
  const [createAchievement, { loading: creating }] = useMutation(CREATE_ACHIEVEMENT_MUTATION)
  const [updateAchievement, { loading: updating }] = useMutation(UPDATE_ACHIEVEMENT_MUTATION)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('editid')
    setEditId(id)
    if (id && data?.getMyAchievements) {
      const found = data.getMyAchievements.find((a: Achievement) => a.id === id)
      if (found) setAchievement(found)
    }
  }, [data])

  const handleSubmit = async (values: Partial<Achievement>) => {
    try {
      if (editId && achievement) {
        const res = await updateAchievement({
          variables: {
            updateAchievementId: editId,
            input: {
              title: values.title,
              description: values.description,
              photos: values.photos,
              date: values.date,
              issuer: values.issuer,
            },
          },
          refetchQueries: [{ query: GET_MY_ACHIEVEMENTS_QUERY_EDITING }, { query: GET_MY_ACHIEVEMENTS_QUERY }],
          awaitRefetchQueries: true,
        })
        // update local Achievement state with returned data when available
        const updated = (res as unknown as { data?: { updateAchievement?: Achievement } })?.data?.updateAchievement
        if (updated) setAchievement(updated)
        toast.success('Achievement updated successfully!')
        navigate('/profile')
      } else {
        const res = await createAchievement({
          variables: {
            input: {
              title: values.title,
              description: values.description,
              photos: values.photos,
              date: values.date,
              issuer: values.issuer,
            },
          },
          refetchQueries: [{ query: GET_MY_ACHIEVEMENTS_QUERY_EDITING }, { query: GET_MY_ACHIEVEMENTS_QUERY }],
          awaitRefetchQueries: true,
        })
        const added = (res as unknown as { data?: { addAchievement?: Achievement } })?.data?.addAchievement
        if (added) setAchievement(added)
        toast.success('Achievement created successfully!')
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Failed to save Achievement', {
        description: error instanceof Error ? error.message : 'Unknown error',
        duration: 5000,
      })
    }
  }

  return (
    <>
      <Meta
        title={editId ? 'Edit Achievement | Only Geeks' : 'Create Achievement | Only Geeks'}
        description={editId ? 'Edit your achievement details on Only Geeks.' : 'Create a new achievement to showcase on Only Geeks.'}
        keywords={editId ? 'edit achievement, only geeks' : 'create achievement, only geeks'}
        image=""
        url={window.location.href}
      />
      <AuthNavbar />
      <div className="container mx-auto mb-10 mt-4">
        <AchievementForm achievement={achievement} onSubmit={handleSubmit} loading={creating || updating} />
      </div>
    </>
  )
}
