import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  type BaseSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from "lexical"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"

export function useUpdateToolbarHandler(
  callback: (selection: BaseSelection) => void
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_editor] = useLexicalComposerContext()
  const { activeEditor } = useToolbarContext()

  useEffect(() => {
    if (!activeEditor) return

    const unregister = activeEditor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection()
        if (selection) {
          callback(selection)
        }
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )

    return unregister
  }, [activeEditor, callback])

  useEffect(() => {
    if (!activeEditor) return
    activeEditor.getEditorState().read(() => {
      const selection = $getSelection()
      if (selection) {
        callback(selection)
      }
    })
  }, [activeEditor, callback])
}
