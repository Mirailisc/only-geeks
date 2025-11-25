import { type InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { $getRoot, type EditorState, type SerializedEditorState } from 'lexical'

import { editorTheme } from '@/components/editor/themes/editor-theme'
import { TooltipProvider } from '@/components/ui/tooltip'
import { EMOJI } from '@/components/editor/transformers/markdown-emoji-transformer'
import { HR } from '@/components/editor/transformers/markdown-hr-transformer'
import { IMAGE } from '@/components/editor/transformers/markdown-image-transformer'
import { TABLE } from '@/components/editor/transformers/markdown-table-transformer'
import { TWEET } from '@/components/editor/transformers/markdown-tweet-transformer'
import { YOUTUBE } from '@/components/editor/transformers/markdown-youtube-transformer'
import { nodes } from './nodes'
import { Plugins } from './plugins'
import type { Blog } from '@/graphql/blog'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import {
  $convertToMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown'

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
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
  blogToLoad,
}: {
  blogToLoad: Blog | null
  setCurrentMarkdown: React.Dispatch<React.SetStateAction<string>>
  debouncedEditorState: EditorState | null
}) => {
  const [editor] = useLexicalComposerContext()

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
        // eslint-disable-next-line no-console
        console.error('Error converting to markdown:', error)
      }
    })
  }, [debouncedEditorState, setCurrentMarkdown])

  // Load blog content from stringified Lexical state
  useEffect(() => {
    if (blogToLoad?.content) {
      try {
        // Parse the stringified Lexical editor state
        const editorState = editor.parseEditorState(blogToLoad.content)
        
        // Set it as the current editor state
        editor.setEditorState(editorState)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading blog content:', error)
      }
    }
  }, [blogToLoad, editor])

  return null
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
    <div className="overflow-hidden rounded-lg border bg-background shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState ? { editorState: JSON.stringify(editorSerializedState) } : {}),
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
