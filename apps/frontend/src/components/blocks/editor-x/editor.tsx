import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { $getRoot, type EditorState, type SerializedEditorState } from "lexical"

import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"
import { EMOJI } from '@/components/editor/transformers/markdown-emoji-transformer'
import { HR } from '@/components/editor/transformers/markdown-hr-transformer'
import { IMAGE } from '@/components/editor/transformers/markdown-image-transformer'
import { TABLE } from '@/components/editor/transformers/markdown-table-transformer'
import { TWEET } from '@/components/editor/transformers/markdown-tweet-transformer'
import { YOUTUBE } from '@/components/editor/transformers/markdown-youtube-transformer'
import { nodes } from "./nodes"
import { Plugins } from "./plugins"
import type { Blog } from "@/graphql/blog"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"
import { $convertFromMarkdownString, $convertToMarkdownString, CHECK_LIST, ELEMENT_TRANSFORMERS, MULTILINE_ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS } from "@lexical/markdown"

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: () => {
    // // eslint-disable-next-line no-console
    // console.error(error)
  },
}

const BlogEditorManager = ({ 
  setCurrentMarkdown, 
  debouncedEditorState, 
  blogToLoad // Blog object to load when component mounts or a new one is selected
}: {
  blogToLoad: Blog | null
  setCurrentMarkdown: React.Dispatch<React.SetStateAction<string>>
  debouncedEditorState: EditorState | null
}) => {
  const [editor] = useLexicalComposerContext(); // ✅ This is now INSIDE the LexicalComposer
  
  // Convert editor state to markdown (MOVED from CreateBlog)
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
        // Pass the markdown up to CreateBlog's state
        setCurrentMarkdown(markdown) 
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error converting to markdown:', error)
      }
    })
  }, [debouncedEditorState, setCurrentMarkdown])
  
  // Effect to load content when a blog is selected (MOVED and adjusted)
  useEffect(() => {
    if (blogToLoad) {
      editor.update(() => {
        const markdownString = blogToLoad.content || ''
        $convertFromMarkdownString(
          markdownString,
          [TABLE, HR, IMAGE, EMOJI, TWEET, YOUTUBE, CHECK_LIST, ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS, ...TEXT_FORMAT_TRANSFORMERS]
        );
      });
      // Important: Only run once per selection, so update the dependency array if needed, 
      // or handle the 'blogToLoad' state transition in CreateBlog.
    }
  }, [blogToLoad, editor]);
  
  // Since you moved handleSelectBlog's editor logic:
  // Now handleSelectBlog in CreateBlog can just update 'blogToLoad' state.
  
  return null; // This component just manages state and effects, no UI needed
}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  blogToLoad,
}: {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
  blogToLoad?: {
    setCurrentMarkdown: React.Dispatch<React.SetStateAction<string>>
    debouncedEditorState: EditorState | null
    blogToLoad: Blog | null
  }
}) {
  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState)
              onSerializedChange?.(editorState.toJSON())
            }}
          />
        </TooltipProvider>
          {blogToLoad && (
            <BlogEditorManager
              setCurrentMarkdown={blogToLoad.setCurrentMarkdown}
              debouncedEditorState={blogToLoad.debouncedEditorState}
              blogToLoad={blogToLoad.blogToLoad}
            />
          )}
      </LexicalComposer>
    </div>
  )
}
