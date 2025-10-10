import type { ElementTransformer } from "@lexical/markdown"

import {
  $createYouTubeNode,
  $isYouTubeNode,
  YouTubeNode,
} from "@/components/editor/nodes/embeds/youtube-node"

export const YOUTUBE: ElementTransformer = {
  dependencies: [YouTubeNode],
  export: (node) => {
    if (!$isYouTubeNode(node)) {
      return null
    }

    return `<youtube id="${node.getId()}" />`
  },
  regExp: /<youtube id="([^"]+?)"\s?\/>\s?$/,
  replace: (textNode, _1, match) => {
    const [, id] = match
    const youtubeNode = $createYouTubeNode(id)
    textNode.replace(youtubeNode)
  },
  type: "element",
}