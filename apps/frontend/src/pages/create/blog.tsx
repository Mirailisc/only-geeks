/* eslint-disable no-console */
import { Editor } from "@/components/blocks/editor-x/editor"
import { EMOJI } from "@/components/editor/transformers/markdown-emoji-transformer"
import { HR } from "@/components/editor/transformers/markdown-hr-transformer"
import { IMAGE } from "@/components/editor/transformers/markdown-image-transformer"
import { TABLE } from "@/components/editor/transformers/markdown-table-transformer"
import { TWEET } from "@/components/editor/transformers/markdown-tweet-transformer"
import { YOUTUBE } from "@/components/editor/transformers/markdown-youtube-transformer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import AuthNavbar from "@/components/utils/AuthNavbar"
import { useDebounce } from "@/hooks/useDebounce"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { $convertToMarkdownString, CHECK_LIST, ELEMENT_TRANSFORMERS, MULTILINE_ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS } from "@lexical/markdown"
import { $getRoot, type EditorState } from "lexical"
import { FileTextIcon, SaveIcon, SendIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

const CreateBlog = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [currentEditorState, setCurrentEditorState] = useState<EditorState | null>(null)
  const debouncedEditorState = useDebounce(currentEditorState, 500)
  const onEditorChange = useCallback((editorState: EditorState) => {
    setCurrentEditorState(editorState)
  }, [])
  
  useEffect(() => {
    if (!debouncedEditorState) {
      // Return early if the editor state is null (e.g., on initial render)
      return 
    }

    // Now, safely execute the conversion logic inside the read context
    // because we know debouncedEditorState is a valid EditorState object
    debouncedEditorState.read(() => {
      try {
        const rootNode = $getRoot() 

        const markdown = $convertToMarkdownString(
          [TABLE, HR, IMAGE, EMOJI, TWEET, YOUTUBE, CHECK_LIST, ...ELEMENT_TRANSFORMERS, 
            ...MULTILINE_ELEMENT_TRANSFORMERS, ...TEXT_FORMAT_TRANSFORMERS, ...TEXT_MATCH_TRANSFORMERS],
          rootNode, 
          true
        )
        
        console.log("Debounced Markdown Output:", markdown)
        
      } catch (error) {
        console.error("Error converting to markdown:", error)
      }
    })
  }, [debouncedEditorState]) // Dependency array watches the debounced value
  return (
    <>
      <AuthNavbar />
      <div className="container mx-auto">
        <div className="flex flex-row gap-2 justify-between items-center mt-6">
          <div className="flex flex-row gap-2">
            <FileTextIcon className="h-6 w-6 text-primary" />
            <Input variant={"ghost-growth"} inputSize={"sm"} maxWidth={isDesktop ? 900 : 400} className="w-52" placeholder="Enter your blog title" />
          </div>
          <div className="flex flex-row gap-2">
            <Button variant={"secondary"}><SaveIcon /> Save Draft</Button>
            <Button variant={"default"}><SendIcon /> Publish</Button>
          </div>
          
        </div>
        <Separator className="my-4" />
        <div>
          <Editor onChange={onEditorChange} />
        </div>
      </div>
    </>
  )
}

export default CreateBlog