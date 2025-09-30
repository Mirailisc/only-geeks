import type { Profile } from '@/pages/Profile'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client/react'
import { UPDATE_PROFILE_INFO_MUTATION } from '@/graphql/profile'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

type Props = {
  profile: Profile
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
}

const formSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  bio: z.string().optional(),
  location: z.string().optional(),
  organization: z.string().optional(),
})

export default function UpdateProfileForm({ profile, setProfile }: Props) {
  const [updateProfileInfo, { loading: updating, error: updateError }] = useMutation<{ updateProfileInfo: Profile }>(
    UPDATE_PROFILE_INFO_MUTATION,
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      location: '',
      organization: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data } = await updateProfileInfo({
      variables: {
        input: { ...values },
      },
    })

    if (data) {
      setProfile(data.updateProfileInfo)
      toast.success('Profile updated successfully!')
    }
  }

  useEffect(() => {
    if (updateError) toast.error(updateError.message)
  }, [updateError])

  useEffect(() => {
    if (profile) {
      form.setValue('firstName', profile.firstName ?? '')
      form.setValue('lastName', profile.lastName ?? '')
      form.setValue('bio', profile.bio ?? '')
      form.setValue('location', profile.location ?? '')
      form.setValue('organization', profile.organization ?? '')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  return (
    <div className='border border-black/10 p-4 rounded-md m-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Say something about yourself"
                    maxLength={100}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input placeholder="Organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full' disabled={updating}>
            {updating ? 'Updating...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
