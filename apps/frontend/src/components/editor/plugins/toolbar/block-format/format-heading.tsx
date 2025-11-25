import { $createHeadingNode, type HeadingTagType } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isTextNode } from 'lexical'

import { useToolbarContext } from '@/components/editor/context/toolbar-context'
import { blockTypeToBlockName } from '@/components/editor/plugins/toolbar/block-format/block-format-data'
import { SelectItem } from '@/components/ui/select'

export function FormatHeading({ levels = [] }: { levels: HeadingTagType[] }) {
  const { activeEditor, blockType } = useToolbarContext()

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      activeEditor.update(() => {
        const selection = $getSelection();
        if (!selection) return;

        // Remove inline color & background color
        selection.getNodes().forEach(node => {
          if ($isTextNode(node)) {
            node.setStyle(''); // remove all inline styles
            node.setFormat(0); // remove text format (bold/italic/etc if you want)
          }
        });

        // Apply heading block type
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  return levels.map((level) => (
    <SelectItem key={level} value={level} onPointerDown={() => formatHeading(level)}>
      <div className="flex items-center gap-1 font-normal">
        {blockTypeToBlockName[level].icon}
        {blockTypeToBlockName[level].label}
      </div>
    </SelectItem>
  ))
}
