import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AuthNavbar from '@/components/utils/AuthNavbar'
import {
  CREATE_EDUCATION_MUTATION,
  GET_MY_EDUCATION_QUERY,
  GET_MY_EDUCATION_QUERY_EDITING,
  UPDATE_EDUCATION_MUTATION,
  type Education,
} from '@/graphql/education'
import { useMutation, useQuery } from '@apollo/client/react'
import { Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface EducationFormValues {
  school: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
}

interface EducationFormProps {
  education?: Education
  onSubmit: (values: Partial<Education>) => void
  loading: boolean
}

function EducationForm({ education, onSubmit, loading }: EducationFormProps) {
  const form = useForm<EducationFormValues>({
    defaultValues: {
      school: education?.school || '',
      degree: education?.degree || '',
      fieldOfStudy: education?.fieldOfStudy || '',
      startDate: education?.startDate ? new Date(education.startDate).toISOString().slice(0, 10) : '',
      endDate: education?.endDate ? new Date(education.endDate).toISOString().slice(0, 10) : '',
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!education) return
    form.reset({
      school: education.school || '',
      degree: education.degree || '',
      fieldOfStudy: education.fieldOfStudy || '',
      startDate: education.startDate ? new Date(education.startDate).toISOString().slice(0, 10) : '',
      endDate: education.endDate ? new Date(education.endDate).toISOString().slice(0, 10) : '',
    })
  }, [education, form])

  const handleSubmit = (values: EducationFormValues) => {
    onSubmit({
      school: values.school,
      degree: values.degree,
      fieldOfStudy: values.fieldOfStudy,
      startDate: values.startDate ? new Date(values.startDate) : undefined,
      endDate: values.endDate ? new Date(values.endDate) : undefined,
    })
  }

  return (
    <Form {...form}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{education ? 'Edit Education' : 'Create Education'}</h1>
        <Button
          type="button"
          className={`inline-flex items-center rounded-md px-4 py-2 text-white ${loading ? 'bg-gray-400' : 'bg-black'}`}
          disabled={loading}
          onClick={() => form.handleSubmit(handleSubmit)()}
          data-cy="submit"
        >
          <Send />
          {loading && education && 'Updating...'}
          {loading && !education && 'Publishing...'}
          {!loading && education && 'Edit'}
          {!loading && !education && 'Publish'}
        </Button>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="rounded-md border border-black/10 p-4">
        <h2 className="font-bold">Show off what you do</h2>
        <p className="mb-6 text-muted-foreground">Share, show off what you do on the past.</p>
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <FormField
              control={form.control}
              name="school"
              rules={{ required: 'School name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="School Name" {...field} data-cy="input-school" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Degree" {...field} data-cy="input-degree" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="Field of Study" {...field} data-cy="input-fieldOfStudy" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default function CreateEducationPage() {
  const navigate = useNavigate()
  const [editId, setEditId] = useState<string | null>(null)
  const [education, setEducation] = useState<Education | undefined>(undefined)
  const { data } = useQuery<{ getMyEducations: Education[] }>(GET_MY_EDUCATION_QUERY_EDITING)
  const [createEducation, { loading: creating }] = useMutation(CREATE_EDUCATION_MUTATION)
  const [updateEducation, { loading: updating }] = useMutation(UPDATE_EDUCATION_MUTATION)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('editId')
    setEditId(id)
    if (id && data?.getMyEducations) {
      const found = data.getMyEducations.find((edu) => edu.id === id)
      if (found) setEducation(found)
    }
  }, [data])

  const handleSubmit = async (values: Partial<Education>) => {
    try {
      if (editId && education) {
        const res = await updateEducation({
          variables: {
            updateEducationId: editId,
            input: {
              school: values.school,
              degree: values.degree,
              fieldOfStudy: values.fieldOfStudy,
              startDate: values.startDate,
              endDate: values.endDate,
            },
          },
          refetchQueries: [{ query: GET_MY_EDUCATION_QUERY_EDITING }, { query: GET_MY_EDUCATION_QUERY_EDITING }],
          awaitRefetchQueries: true,
        })
        const updated = (res as unknown as { data?: { updateEducation?: Education } })?.data?.updateEducation
        if (updated) setEducation(updated)
        toast.success('Education updated successfully')
        navigate('/profile')
      } else {
        const res = await createEducation({
          variables: {
            input: {
              school: values.school,
              degree: values.degree,
              fieldOfStudy: values.fieldOfStudy,
              startDate: values.startDate,
              endDate: values.endDate,
            },
          },
          refetchQueries: [{ query: GET_MY_EDUCATION_QUERY }, { query: GET_MY_EDUCATION_QUERY_EDITING }],
          awaitRefetchQueries: true,
        })
        const added = (res as unknown as { data?: { createEducation?: Education } })?.data?.createEducation
        if (added) setEducation(added)
        toast.success('Education created successfully!')
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Failed to update education', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        duration: 5000,
      })
    }
  }
  return (
    <>
      <AuthNavbar />
      <div className="container mx-auto py-4">
        <EducationForm education={education} onSubmit={handleSubmit} loading={creating || updating} />
      </div>
    </>
  )
}
