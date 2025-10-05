import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client/react'
import { UPDATE_PROFILE_INFO_MUTATION, type Profile } from '@/graphql/profile'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
// import { Switch } from '../ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Label } from '../ui/label'
import { UploadCloudIcon } from 'lucide-react'
// import { UploadCloudIcon } from 'lucide-react'

type Props = {
  profile: Profile
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
}

const formSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  picture: z.url().nonempty('Picture URL is required').optional(),
  username: z.string().nonempty('Username is required'),
  bio: z.string().optional(),
  location: z.string().optional(),
  organization: z.string().optional(),
})

export default function UpdateProfileForm({ profile, setProfile }: Props) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [currentImageUrl, setCurrentImageUrl] = React.useState<null | string>(null)
  const [updateProfileInfo, { loading: updating, error: updateError }] = useMutation<{ updateProfileInfo: Profile }>(
    UPDATE_PROFILE_INFO_MUTATION,
  )

  // console.log(isUploading);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      username: '',
      lastName: '',
      bio: '',
      location: '',
      organization: '',
      picture: '',
    },
  })
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
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

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const url = data.url

      form.setValue('picture', url)
      setCurrentImageUrl(url)
      // console.log("Uploaded URL:", url)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Upload error:', error)
      // alert("Failed to upload image")
      toast.error('Failed to upload image', {
        description: (error as Error).message,
        duration: 5000,
      })
    } finally {
      setIsUploading(false)
    }
  }

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
      form.setValue('username', profile.username ?? '')
      form.setValue('picture', profile.picture ?? '')
      setCurrentImageUrl(profile.picture || null)
      form.setValue('organization', profile.organization ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  return (
    <div className="rounded-md border border-black/10 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex w-max flex-col items-center space-y-4 text-center">
              <Label>Profile Image</Label>
              <Avatar className="mb-4 h-[150px] w-[150px]">
                <AvatarImage src={currentImageUrl || ''} alt={profile?.firstName || 'Avatar'} />
                <AvatarFallback className="text-5xl">
                  {profile.firstName[0].toUpperCase()}
                  {profile.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <input id="file-input" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <div className="flex items-center gap-2">
                <Button
                  type={'button'}
                  variant={'outline'}
                  onClick={() => document.getElementById('file-input')?.click()}
                  size={'sm'}
                  disabled={isUploading}
                >
                  <UploadCloudIcon className="mr-2 h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col space-y-4">
              <div className="flex w-full flex-col gap-4 md:flex-row">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" className="w-full" {...field} data-cy="input-firstName" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" className="w-full" {...field} data-cy="input-lastName" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" className="w-full" {...field} data-cy="input-username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => {
                  const bioValue = field.value ?? ''
                  return (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <div>
                          <Textarea
                            placeholder="Say something about yourself"
                            maxLength={100}
                            className="h-28 resize-none"
                            {...field}
                            value={bioValue}
                            onChange={(e) => field.onChange(e.target.value)}
                            data-cy="input-bio"
                          />
                          <div className="mt-1 text-right text-xs text-muted-foreground">{bioValue.length}/100</div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex-1">
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
                <FormItem className="flex-1">
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization" {...field} data-cy="input-organization" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="mt-4 w-full" disabled={updating} data-cy="submit">
            {updating ? 'Updating...' : 'Submit'}
          </Button>
          <h4 className="mt-2 text-sm text-muted-foreground">You&apos;re login as {profile?.email}</h4>
        </form>
      </Form>
    </div>
  )
}
