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
// import { UploadCloudIcon } from 'lucide-react'

type Props = {
  profile: Profile
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
}

const formSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  picture: z.url().nonempty('Picture URL is required'),
  username: z.string().nonempty('Username is required'),
  bio: z.string().optional(),
  location: z.string().optional(),
  organization: z.string().optional(),
})

export default function UpdateProfileForm({ profile, setProfile }: Props) {
  // const [isUploading, setIsUploading] = React.useState(false);
  const [currentImageUrl, setCurrentImageUrl] = React.useState<null|string>(null);
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
  // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (!file) return

  //   // Check if it's an image
  //   if (!file.type.startsWith("image/")) {
  //     alert("Please select an image file")
  //     return
  //   }
  //   setIsUploading(true)

  //   try {
  //     const formData = new FormData()
  //     formData.append("file", file)
  //     formData.append("uploadType", "0")

  //     const response = await fetch("https://up.m1r.ai/upload", {
  //       method: "POST",
  //       body: formData,
  //     })

  //     if (!response.ok) {
  //       throw new Error("Upload failed")
  //     }

  //     const data = await response.json()
  //     const url = data.url

  //     form.setValue('picture', url)
  //     setCurrentImageUrl(url);
  //     // console.log("Uploaded URL:", url)
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error("Upload error:", error)
  //     // alert("Failed to upload image")
  //     toast.error("Failed to upload image", {
  //       description: (error as Error).message,
  //       duration: 5000,
  //     })
  //   } finally {
  //     setIsUploading(false)
  //   }
  // }
  
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
      setCurrentImageUrl(profile.picture || null);
      form.setValue('organization', profile.organization ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])


  return (
    <div className="rounded-md border border-black/10 p-4">
      {/* <input id="file-input" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" /> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex-col sm:items-start items-center flex sm:flex-row gap-4 w-full">
            <div className="text-center space-y-4 w-max flex flex-col items-center">
              <Label>Profile Image</Label>
              <Avatar className='w-[150px] h-[150px] mb-4'>
                <AvatarImage src={currentImageUrl || ""} alt={profile?.firstName || 'Avatar'} />
                <AvatarFallback className='text-5xl'>
                  {profile.firstName[0].toUpperCase()}
                  {profile.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* <div className="flex items-center gap-2">
                <Button type={"button"} variant={"outline"} onClick={() => document.getElementById("file-input")?.click()} size={"sm"} disabled={isUploading}>
                  <UploadCloudIcon className="mr-2 h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
              </div> */}
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
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" className='w-full' {...field} data-cy="input-username" />
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
                  const bioValue = field.value ?? '';
                  return (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <div>
                          <Textarea
                          placeholder="Say something about yourself"
                          maxLength={100}
                          className="resize-none h-28"
                          {...field}
                          value={bioValue}
                          onChange={(e) => field.onChange(e.target.value)}
                          data-cy="input-bio"
                        />
                        <div className="text-right text-xs text-muted-foreground mt-1">
                          {bioValue.length}/100
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}}
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
          <span className='text-sm mt-4 text-muted-foreground'>You&apos;re login as {profile?.email}</span>
        </form>
      </Form>
    </div>
  )
}
