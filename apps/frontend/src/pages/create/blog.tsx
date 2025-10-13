/* eslint-disable no-console */
import { useCallback, useEffect, useState, useMemo } from 'react'
import { FileText, Send, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
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
import { $convertToMarkdownString, CHECK_LIST, ELEMENT_TRANSFORMERS, MULTILINE_ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS } from '@lexical/markdown'
import { $getRoot, type EditorState } from 'lexical'
import { useMutation, useQuery } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { CREATE_BLOG_MUTATION, GET_MY_BLOGS_QUERY, UPDATE_BLOG_MUTATION, type Blog } from '@/graphql/blog'
import { dateFormatter, extractMarkdownContent } from '@/lib/utils'
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { TabsList } from '@radix-ui/react-tabs'

const CreateBlog = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const navigate = useNavigate()
  
  // State management
  const [showBlogListDialog, setShowBlogListDialog] = useState(true)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null)
  const [blogTitle, setBlogTitle] = useState('Untitled')
  const [currentEditorState, setCurrentEditorState] = useState<EditorState | null>(null)
  const [currentMarkdown, setCurrentMarkdown] = useState<string>('')
  const [publishVisibility, setPublishVisibility] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState(false)
  const [blogToLoad, setBlogToLoad] = useState<Blog | null>(null) 
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const debouncedEditorState = useDebounce(currentEditorState, 1000)
  // const debouncedTitle = useDebounce(blogTitle, 1000)
  const debouncedMarkdown = useDebounce(currentMarkdown, 1000)
  const debouncedSaveTrigger = useDebounce({
    markdown: currentMarkdown,
    title: blogTitle
  }, 2000) // 5 seconds debounce
  // Extract thumbnail and description from markdown
  const { thumbnail, description } = useMemo(() => {
    if (!debouncedMarkdown) {
      return { thumbnail: null, description: null }
    }
    
    const { firstImage, plainText } = extractMarkdownContent(debouncedMarkdown)
    return {
      thumbnail: firstImage,
      description: plainText || null
    }
  }, [debouncedMarkdown])
  
  // GraphQL queries and mutations
  const { data, loading, error } = useQuery<{ getMyBlogs: Blog[] }>(GET_MY_BLOGS_QUERY)
  const [createBlog] = useMutation<{createBlog: Blog}>(CREATE_BLOG_MUTATION)
  const [updateBlog] = useMutation(UPDATE_BLOG_MUTATION, {
    refetchQueries: [{ query: GET_MY_BLOGS_QUERY }]
  })
  
  // Filter unpublished blogs
  const unpublishedBlogs = data?.getMyBlogs?.filter(blog => !blog.isPublished) || []
  const publishedBlogs = data?.getMyBlogs?.filter(blog => blog.isPublished) || []
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
          [TABLE, HR, IMAGE, EMOJI, TWEET, YOUTUBE, CHECK_LIST, ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS, ...TEXT_FORMAT_TRANSFORMERS, ...TEXT_MATCH_TRANSFORMERS],
          rootNode,
          true
        )
        setCurrentMarkdown(markdown)
      } catch (error) {
        console.error('Error converting to markdown:', error)
      }
    })
  }, [debouncedEditorState])
  
  // Auto-save functionality (Google Docs style)
  useEffect(() => {
    const { markdown: debouncedMarkdownForSave, title: debouncedTitleForSave } = debouncedSaveTrigger;
    
    // Check if we have a blog to save to
    if (!currentBlog) return
  
    const autoSave = async () => {
      if (!currentBlog) return;

      // Check if the content has changed since the currentBlog state was set/updated
      const contentChanged = currentBlog.content !== debouncedMarkdownForSave;
      const titleChanged = currentBlog.title !== debouncedTitleForSave;

      // Only save if either content or title has changed
      // AND if the debounced content is not empty (to avoid saving empty content immediately)
      if (contentChanged || titleChanged) {
          setIsSaving(true);
          try {
              // Using the current title/markdown which are now the debounced values
              await updateBlog({
                  variables: {
                      blogId: currentBlog.id,
                      input: {
                          title: debouncedTitleForSave,
                          content: debouncedMarkdownForSave,
                          // Using the derived values which are based on the 1s debounce, fine.
                          description: description,
                          thumbnail: thumbnail
                      }
                  }
              });
              setLastSaved(new Date());
              
              // OPTIONAL BUT RECOMMENDED: Update currentBlog with the saved data
              // This is crucial for the comparison logic above to work correctly on subsequent saves.
              setCurrentBlog(prev => prev ? { 
                  ...prev, 
                  title: debouncedTitleForSave, 
                  content: debouncedMarkdownForSave,
                  description: description,
                  thumbnail: thumbnail,
                  updatedAt: new Date().toISOString()
              } : null);

          } catch (error) {
              console.error('Auto-save failed:', error);
          } finally {
              setIsSaving(false);
          }
      }
    };
    
    // Trigger auto-save only when the 5s debounced values change
    autoSave();
    
  }, [
      debouncedSaveTrigger, 
      currentBlog, 
      updateBlog, 
      description, 
      thumbnail, 
      setCurrentBlog // Include setter if updating state inside the effect
  ])
  
  // Handle creating new blog
  const handleCreateNewBlog = async () => {
    try {
      const { data } = await createBlog({
        variables: {
          input: {
            title: 'Untitled',
            content: '',
            description: null,
            thumbnail: null
          }
        },
        refetchQueries: [{ query: GET_MY_BLOGS_QUERY }]
      })
      console.log('Create blog response:', data)
      if (data?.createBlog) {
        setCurrentBlog(data.createBlog)
        setBlogTitle('Untitled')
        setCurrentMarkdown('')
        setShowBlogListDialog(false)
      }
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }
  
  // console.log('Current Editor State:', currentEditorState)
  // Handle selecting existing blog
  const handleSelectBlog = (blog: Blog) => {
    setCurrentBlog(blog)
    setBlogTitle(blog.title)
    // We set the content in the parent state, and let the new child component handle
    // loading it into the Lexical Editor instance.
    setCurrentMarkdown(blog.content || '') 
    setBlogToLoad(blog); // <--- New: Signal to the child component to load this blog
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
            isPublished: publishVisibility
          }
        }
      })
      setShowPublishDialog(false)
      setCurrentBlog(prev => prev ? { ...prev, isPublished: publishVisibility } : null)
    } catch (error) {
      console.error('Publish failed:', error)
    }
  }
  
  return (
    <>
      <AuthNavbar />
      
      <Dialog open={showBlogListDialog} onOpenChange={()=>{
        setShowBlogListDialog(false);
        navigate('/profile');
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Blogs</DialogTitle>
            <DialogDescription>
              Select a draft or published to continue editing or create a new blog
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="drafts" className='w-full mt-4'>
            <TabsList className='w-full mb-4'>
              <TabsTrigger className='w-1/2' value="drafts">Drafts</TabsTrigger>
              <TabsTrigger className='w-1/2' value="published">Published</TabsTrigger>
            </TabsList>
            <TabsContent value="drafts">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                
                {error && (
                  <div className="text-center py-8 text-destructive">
                    Error loading blogs: {error.message}
                  </div>
                )}
                
                {!loading && !error && (
                  <div className="space-y-2">
                    {/* Create New Blog Button */}
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto py-4 border-2 border-dashed hover:border-primary"
                      onClick={handleCreateNewBlog}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Create New Blog</div>
                        <div className="text-sm text-muted-foreground">Start writing a new blog post</div>
                      </div>
                    </Button>
                    
                    {/* Existing Drafts */}
                    {unpublishedBlogs.map((blog) => (
                      <Button
                        key={blog.id}
                        variant="ghost"
                        className="w-full justify-start h-auto py-4 text-left"
                        onClick={() => handleSelectBlog(blog)}
                      >
                        <FileText className="mr-2 h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{blog.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Last edited: {dateFormatter(blog.updatedAt)}
                          </div>
                        </div>
                      </Button>
                    ))}
                    
                    {unpublishedBlogs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
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
                
                {error && (
                  <div className="text-center py-8 text-destructive">
                    Error loading blogs: {error.message}
                  </div>
                )}
                
                {!loading && !error && (
                  <div className="space-y-2">                    
                    {/* Existing Drafts */}
                    {publishedBlogs.map((blog) => (
                      <Button
                        key={blog.id}
                        variant="ghost"
                        className="w-full justify-start h-auto py-4 text-left"
                        onClick={() => handleSelectBlog(blog)}
                      >
                        <FileText className="mr-2 h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{blog.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Last edited: {dateFormatter(blog.updatedAt, true)}
                          </div>
                        </div>
                      </Button>
                    ))}
                    
                    {publishedBlogs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No draft blogs found. Create your first blog!
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
            <DialogDescription>
              Choose the visibility for your blog post
            </DialogDescription>
          </DialogHeader>
          
          <RadioGroup value={publishVisibility ? 'true' : 'false'} onValueChange={(value) => {
            setPublishVisibility(value === 'true')
          }}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="published" />
              <Label htmlFor="published" className="cursor-pointer">
                <div className="font-semibold">Published</div>
                <div className="text-sm text-muted-foreground">Make this blog visible to everyone</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="draft" />
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
            <Button onClick={handlePublish}>
              {publishVisibility ? 'Publish' : 'Save as Draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto">
        <div className="flex flex-row gap-2 justify-between items-center mt-6">
          <div className="flex flex-row gap-2 items-center">
            <FileText className="h-6 w-6 text-primary flex-shrink-0" />
            <Input
              variant="ghost-growth"
              inputSize="sm"
              maxWidth={isDesktop ? 900 : 400}
              className="w-52"
              placeholder="Enter your blog title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
            {isSaving && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </span>
            )}
            {!isSaving && lastSaved && (
              <span className="text-sm text-muted-foreground">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {
              //publish status
              !isSaving && !currentBlog?.isPublished && (
                <span className="text-sm text-yellow-500 font-medium">
                  Draft
                </span>
              )
            }
            {
              !isSaving && currentBlog?.isPublished && (
                <span className="text-sm text-green-500 font-medium">
                  Published
                </span>
              )
            }
          </div>
          <div className="flex flex-row gap-2">
            {/* <Button variant="secondary" onClick={saveDraft} disabled={isSaving}>
              <Save /> Save Draft
            </Button> */}
            <Button variant="default" onClick={() => setShowPublishDialog(true)}>
              <Send /> Publish
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <Editor 
            onChange={onEditorChange}
            blogToLoad={{
              setCurrentMarkdown:setCurrentMarkdown, 
              debouncedEditorState:debouncedEditorState,
              blogToLoad:blogToLoad,
            }}
          />
        </div>
      </div>
    </>
  )
}

export default CreateBlog