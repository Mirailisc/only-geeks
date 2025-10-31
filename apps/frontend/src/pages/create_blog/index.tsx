/* eslint-disable no-console */
import { useCallback, useEffect, useState, useMemo } from 'react'
import { FileText, Send, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import AuthNavbar from '@/components/utils/AuthNavbar'
import { useDebounce } from '@/hooks/useDebounce'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Editor } from '@/components/blocks/editor-x/editor'
import { EMOJI } from '@/components/editor/transformers/markdown-emoji-transformer'
import { HR } from '@/components/editor/transformers/markdown-hr-transformer'
import { IMAGE } from '@/components/editor/transformers/markdown-image-transformer'
import { TABLE } from '@/components/editor/transformers/markdown-table-transformer'
import { TWEET } from '@/components/editor/transformers/markdown-tweet-transformer'
import { YOUTUBE } from '@/components/editor/transformers/markdown-youtube-transformer'
import {
  $convertToMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown'
import { $getRoot, type EditorState } from 'lexical'
import { useMutation, useQuery } from '@apollo/client/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CREATE_BLOG_MUTATION, GET_MY_BLOGS_QUERY_EDITED_MODE, UPDATE_BLOG_MUTATION, type Blog } from '@/graphql/blog'
import { dateFormatter, extractMarkdownContent } from '@/lib/utils'
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { TabsList } from '@radix-ui/react-tabs'
import { useAppSelector } from '@/hooks/useAppSelector'

const CreateBlog = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  // State management
  const [showBlogListDialog, setShowBlogListDialog] = useState(true)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null)
  const [blogTitle, setBlogTitle] = useState('Untitled')
  const [currentEditorState, setCurrentEditorState] = useState<EditorState | null>(null)
  const [currentMarkdown, setCurrentMarkdown] = useState<string>('')
  const [publishVisibility, setPublishVisibility] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState(false)
  const [blogToLoad, setBlogToLoad] = useState<Blog | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [searchParams] = useSearchParams()
  const editid = searchParams.get('editid')

  const debouncedEditorState = useDebounce(currentEditorState, 1000)
  const debouncedMarkdown = useDebounce(currentMarkdown, 1000)
  const debouncedSaveTrigger = useDebounce(
    {
      markdown: currentMarkdown,
      title: blogTitle,
    },
    2000,
  )

  // Extract thumbnail and description from markdown
  const { thumbnail, description } = useMemo(() => {
    if (!debouncedMarkdown) {
      return { thumbnail: null, description: null }
    }

    const { firstImage, plainText } = extractMarkdownContent(debouncedMarkdown)
    return {
      thumbnail: firstImage,
      description: plainText || null,
    }
  }, [debouncedMarkdown])

  // GraphQL queries and mutations
  const { data, loading, error } = useQuery<{ getMyBlogs: Blog[] }>(GET_MY_BLOGS_QUERY_EDITED_MODE)
  const [createBlog] = useMutation<{ createBlog: Blog }>(CREATE_BLOG_MUTATION)
  const [updateBlog] = useMutation(UPDATE_BLOG_MUTATION, {
    refetchQueries: [{ query: GET_MY_BLOGS_QUERY_EDITED_MODE }],
  })

  // Filter unpublished blogs
  const unpublishedBlogs = useMemo(() => data?.getMyBlogs?.filter((blog) => !blog.isPublished) || [], [data])
  const publishedBlogs = useMemo(() => data?.getMyBlogs?.filter((blog) => blog.isPublished) || [], [data])

  // If editid is present in URL, we should load that blog directly
  useEffect(() => {
    if (editid && isInitialLoad) {
      const toEdit =
        unpublishedBlogs.find((blog) => blog.id === editid) || publishedBlogs.find((blog) => blog.id === editid)
      if (toEdit) {
        handleSelectBlog(toEdit)
        setIsInitialLoad(false)
      }
    }
  }, [editid, unpublishedBlogs, publishedBlogs, isInitialLoad])

  // Handle editor changes
  const onEditorChange = useCallback((editorState: EditorState) => {
    setCurrentEditorState(editorState)
  }, [])

  // Convert editor state to markdown
  useEffect(() => {
    if (!debouncedEditorState) return

    debouncedEditorState.read(() => {
      try {
        const rootNode = $getRoot()
        const markdown = $convertToMarkdownString(
          [
            TABLE,
            HR,
            IMAGE,
            EMOJI,
            TWEET,
            YOUTUBE,
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ],
          rootNode,
          true,
        )
        setCurrentMarkdown(markdown)
      } catch (error) {
        console.error('Error converting to markdown:', error)
      }
    })
  }, [debouncedEditorState])

  // Auto-save functionality (Google Docs style)
  useEffect(() => {
    const { markdown: debouncedMarkdownForSave, title: debouncedTitleForSave } = debouncedSaveTrigger

    if (!currentBlog || isInitialLoad) return

    const autoSave = async () => {
      if (!currentBlog) return
      const contentChanged = currentBlog.content !== debouncedMarkdownForSave
      const titleChanged = currentBlog.title !== debouncedTitleForSave

      if ((contentChanged || titleChanged) && debouncedMarkdownForSave.trim() !== '') {
        setIsSaving(true)
        try {
          await updateBlog({
            variables: {
              blogId: currentBlog.id,
              input: {
                title: debouncedTitleForSave,
                content: debouncedMarkdownForSave,
                description: description,
                thumbnail: thumbnail,
              },
            },
          })
          setLastSaved(new Date())

          setCurrentBlog((prev) =>
            prev
              ? {
                  ...prev,
                  title: debouncedTitleForSave,
                  content: debouncedMarkdownForSave,
                  description: description,
                  thumbnail: thumbnail,
                  updatedAt: new Date().toISOString(),
                }
              : null,
          )
        } catch (error) {
          console.error('Auto-save failed:', error)
        } finally {
          setIsSaving(false)
        }
      }
    }

    autoSave()
  }, [debouncedSaveTrigger, currentBlog, updateBlog, description, thumbnail, setCurrentBlog, isInitialLoad])

  // Handle creating new blog
  const handleCreateNewBlog = async () => {
    try {
      const { data } = await createBlog({
        variables: {
          input: {
            title: 'Untitled',
            content: '',
            description: null,
            thumbnail: null,
          },
        },
        refetchQueries: [{ query: GET_MY_BLOGS_QUERY_EDITED_MODE }],
      })
      console.log('Create blog response:', data)
      if (data?.createBlog) {
        setCurrentBlog(data.createBlog)
        setBlogTitle('Untitled')
        setCurrentMarkdown('')
        setShowBlogListDialog(false)
        setIsInitialLoad(false)
      }
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  // Handle selecting existing blog
  const handleSelectBlog = (blog: Blog) => {
    setCurrentBlog(blog)
    setBlogTitle(blog.title)
    setCurrentMarkdown(blog.content || '')
    setBlogToLoad(blog)
    setShowBlogListDialog(false)
  }

  // Handle publish
  const handlePublish = async () => {
    if (!currentBlog) return

    try {
      await updateBlog({
        variables: {
          blogId: currentBlog.id,
          input: {
            title: blogTitle,
            content: currentMarkdown,
            description: description,
            thumbnail: thumbnail,
            isPublished: publishVisibility,
          },
        },
      })

      setCurrentBlog((prev) => (prev ? { ...prev, isPublished: publishVisibility } : null))
      setShowPublishDialog(false)
      setShowSuccessAlert(true)
    } catch (error) {
      console.error('Publish failed:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to publish blog. Please try again.')
      setShowErrorAlert(true)
    }
  }

  // Handle success alert navigation
  const handleSuccessNavigate = () => {
    setShowSuccessAlert(false)
    const titleToSlug = blogTitle.toLowerCase().replace(/\s+/g, '-')
    navigate(`/blog/${user?.username}/${titleToSlug}`)
  }

  return (
    <>
      <AuthNavbar />

      {/* Blog List Dialog */}
      <Dialog
        open={showBlogListDialog}
        onOpenChange={() => {
          setShowBlogListDialog(false)
          navigate('/profile')
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Blogs</DialogTitle>
            <DialogDescription>Select a draft or published to continue editing or create a new blog</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="drafts" className="mt-4 w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger className="w-1/2" data-cy="crud-blog-drafts-tab" value="drafts">
                Drafts
              </TabsTrigger>
              <TabsTrigger className="w-1/2" data-cy="crud-blog-published-tab" value="published">
                Published
              </TabsTrigger>
            </TabsList>
            <TabsContent value="drafts">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {error && <div className="py-8 text-center text-destructive">Error loading blogs: {error.message}</div>}

                {!loading && !error && (
                  <div className="space-y-2">
                    <Button
                      data-cy="create-new-blog-button"
                      variant="outline"
                      className="h-auto w-full justify-start border-2 border-dashed py-4 hover:border-primary"
                      onClick={handleCreateNewBlog}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Create New Blog</div>
                        <div className="text-sm text-muted-foreground">Start writing a new blog post</div>
                      </div>
                    </Button>

                    {unpublishedBlogs.map((blog) => (
                      <Button
                        key={blog.id}
                        variant="ghost"
                        className="h-auto w-full justify-start py-4 text-left"
                        onClick={() => handleSelectBlog(blog)}
                      >
                        <FileText className="mr-2 h-5 w-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">{blog.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Last edited: {dateFormatter(blog.updatedAt)}
                          </div>
                        </div>
                      </Button>
                    ))}

                    {unpublishedBlogs.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground">
                        No draft blogs found. Create your first blog!
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="published">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {error && <div className="py-8 text-center text-destructive">Error loading blogs: {error.message}</div>}

                {!loading && !error && (
                  <div className="space-y-2">
                    {publishedBlogs.map((blog) => (
                      <Button
                        key={blog.id}
                        variant="ghost"
                        className="h-auto w-full justify-start py-4 text-left"
                        onClick={() => handleSelectBlog(blog)}
                      >
                        <FileText className="mr-2 h-5 w-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">{blog.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Last edited: {dateFormatter(blog.updatedAt, true)}
                          </div>
                        </div>
                      </Button>
                    ))}

                    {publishedBlogs.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground">
                        No published blogs found. Publish your first blog!
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Blog</DialogTitle>
            <DialogDescription>Choose the visibility for your blog post</DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={publishVisibility ? 'true' : 'false'}
            onValueChange={(value) => {
              setPublishVisibility(value === 'true')
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem data-cy="vis-published-mode" value="true" id="published" />
              <Label htmlFor="published" className="cursor-pointer">
                <div className="font-semibold">Published</div>
                <div className="text-sm text-muted-foreground">Make this blog visible to everyone</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem data-cy="vis-draft-mode" value="false" id="draft" />
              <Label htmlFor="draft" className="cursor-pointer">
                <div className="font-semibold">Keep as Draft</div>
                <div className="text-sm text-muted-foreground">Only you can see this blog</div>
              </Label>
            </div>
          </RadioGroup>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              Cancel
            </Button>
            <Button data-cy="blog-publish-button" onClick={handlePublish}>
              {publishVisibility ? 'Publish' : 'Save as Draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Alert Dialog */}
      <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              Your blog has been {publishVisibility ? 'published' : 'saved as draft'} successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              data-cy="view-blog-button"
              onClick={() => {
                if (publishVisibility) {
                  handleSuccessNavigate()
                } else {
                  setShowSuccessAlert(false)
                }
              }}
            >
              View Blog
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Alert Dialog */}
      <AlertDialog open={showErrorAlert} onOpenChange={setShowErrorAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <AlertDialogAction onClick={() => setShowErrorAlert(false)}>Try Again</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto">
        <div className="mt-6 flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-2">
            <FileText className="h-6 w-6 flex-shrink-0 text-primary" />
            <Input
              variant="ghost-growth"
              inputSize="sm"
              data-cy="input-blog-title"
              maxWidth={isDesktop ? 900 : 400}
              className="w-52"
              placeholder="Enter your blog title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
            {isSaving && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </span>
            )}
            {!isSaving && lastSaved && (
              <span className="text-sm text-muted-foreground">Saved {lastSaved.toLocaleTimeString()}</span>
            )}
            {!isSaving && !currentBlog?.isPublished && (
              <span className="text-sm font-medium text-yellow-500">Draft</span>
            )}
            {!isSaving && currentBlog?.isPublished && (
              <span className="text-sm font-medium text-green-500">Published</span>
            )}
          </div>
          <div className="flex flex-row gap-2">
            <Button data-cy="blog-submit-button" variant="default" onClick={() => setShowPublishDialog(true)}>
              <Send /> {currentBlog?.isPublished ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <Editor
            onChange={onEditorChange}
            blogToLoad={{
              setCurrentMarkdown: setCurrentMarkdown,
              debouncedEditorState: debouncedEditorState,
              blogToLoad: blogToLoad,
            }}
          />
        </div>
      </div>
    </>
  )
}

export default CreateBlog
