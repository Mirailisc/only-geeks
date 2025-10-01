import type { Profile } from '@/pages/profile'
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
// import { Switch } from '../ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Label } from '../ui/label'

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
    <div className="rounded-md border border-black/10 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className='flex-col items-center flex sm:flex-row gap-4 w-full'>
            <div className='text-center space-y-4 w-max'>
              <Label>Profile Image</Label>
              <Avatar className='w-[180px] h-[180px] mb-4'>
                <AvatarImage src={profile?.picture || undefined} alt={profile?.firstName || 'Avatar'} />
                <AvatarFallback className='text-5xl'>
                {profile.firstName[0].toUpperCase()}
                {profile.lastName[0].toUpperCase()}
              </AvatarFallback>
              </Avatar>
            </div>
            <div className='flex flex-col space-y-4 w-full'>
              <div className='flex flex-col md:flex-row gap-4 w-full'>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" className='w-full' {...field} data-cy="input-firstName" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" className='w-full' {...field} data-cy="input-lastName" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className='flex-1'>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" className='w-full' disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
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
                        data-cy="input-bio"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} data-cy="input-location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization" {...field} data-cy="input-organization" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={updating} data-cy="submit">
            {updating ? 'Updating...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
