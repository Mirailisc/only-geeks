/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { slugify } from '@/lib/utils'

type Props = {
  content?: string
  className?: string
}

export default function MarkdownViewer({ content = '', className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  let md = content
    .replace(/^[\t ]+/gm, '')
    .replace(/\r\n/g, '\n')
    .trim()

  let youtubeCounter = 0
  let tweetCounter = 0

  md = md.replace(/<youtube\s+id="([^"]+)"\s*\/>/g, (_match, id) => {
    return `<div class="youtube-embed-${youtubeCounter++}" data-youtube-id="${id}"></div>`
  })

  md = md.replace(/<tweet\s+id="([^"]+)"\s*\/>/g, (_match, id) => {
    return `<div class="tweet-embed-${tweetCounter++}" data-tweet-id="${id}"></div>`
  })

  useEffect(() => {
    if (!containerRef.current) return

    // --- YouTube embeds ---
    const youtubePlaceholders = containerRef.current.querySelectorAll('[data-youtube-id]')
    youtubePlaceholders.forEach((placeholder) => {
      const id = placeholder.getAttribute('data-youtube-id')
      if (id) {
        const wrapper = document.createElement('div')
        wrapper.className = 'my-4 aspect-video w-full flex flex-col items-center'
        wrapper.innerHTML = `
          <iframe
            class="w-[550px] aspect-video rounded-lg"
            src="https://www.youtube.com/embed/${id}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        `
        placeholder.replaceWith(wrapper)
      }
    })

    // --- Tweet embeds ---
    const tweetPlaceholders = containerRef.current.querySelectorAll('[data-tweet-id]')
    tweetPlaceholders.forEach((placeholder) => {
      const id = placeholder.getAttribute('data-tweet-id')
      if (id) {
        const wrapper = document.createElement('div')
        wrapper.className = 'my-4 flex justify-center'
        wrapper.style.maxWidth = '700px'
        wrapper.style.margin = '1rem auto'

        const tweetBlockquote = document.createElement('blockquote')
        tweetBlockquote.className = 'twitter-tweet'
        tweetBlockquote.innerHTML = `<a href="https://twitter.com/i/status/${id}"></a>`

        wrapper.appendChild(tweetBlockquote)
        placeholder.replaceWith(wrapper)
      }
    })

    // --- Twitter script load ---
    const loadTwitterWidgets = () => {
      if (window.twttr?.widgets) {
        window.twttr.widgets.load(containerRef.current!)
      }
    }

    if (!window.twttr) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.charset = 'utf-8'

      if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
        document.body.appendChild(script)
      }

      script.onload = loadTwitterWidgets
    } else {
      loadTwitterWidgets()
    }
  }, [content])

  // --- Markdown heading renderer with anchors ---
  const components = {
    h1: ({ node, children, ...props }: any) => {
      const text = String(children)
      const id = slugify(text)
      return (
        <h1 id={id} {...props} className="scroll-mt-24">
          <a href={`#${id}`} className="no-underline hover:underline dark:text-white">
            {children}
          </a>
        </h1>
      )
    },
    h2: ({ node, children, ...props }: any) => {
      const text = String(children)
      const id = slugify(text)
      return (
        <h2 id={id} {...props} className="scroll-mt-24">
          <a href={`#${id}`} className="no-underline hover:underline dark:text-white">
            {children}
          </a>
        </h2>
      )
    },
    h3: ({ node, children, ...props }: any) => {
      const text = String(children)
      const id = slugify(text)
      return (
        <h3 id={id} {...props} className="scroll-mt-24">
          <a href={`#${id}`} className="no-underline hover:underline dark:text-white">
            {children}
          </a>
        </h3>
      )
    },
    h4: ({ node, children, ...props }: any) => {
      const text = String(children)
      const id = slugify(text)
      return (
        <h4 id={id} {...props} className="scroll-mt-24">
          <a href={`#${id}`} className="no-underline hover:underline dark:text-white">
            {children}
          </a>
        </h4>
      )
    },
    h5: ({ node, children, ...props }: any) => {
      const text = String(children)
      const id = slugify(text)
      return (
        <h5 id={id} {...props} className="scroll-mt-24">
          <a href={`#${id}`} className="no-underline hover:underline dark:text-white">
            {children}
          </a>
        </h5>
      )
    },
    h6: ({ node, children, ...props }: any) => {
      const text = String(children)
      const id = slugify(text)
      return (
        <h6 id={id} {...props} className="scroll-mt-24">
          <a href={`#${id}`} className="no-underline hover:underline dark:text-white">
            {children}
          </a>
        </h6>
      )
    },
  }

  return (
    <div ref={containerRef} className={className ?? 'prose dark:text-white prose-no-backticks prose-no-m w-full !max-w-full px-6'}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {md}
      </ReactMarkdown>
    </div>
  )
}

// TypeScript declaration for Twitter widgets
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void
        createTweet: (
          tweetId: string,
          targetEl: HTMLElement,
          options?: { theme?: string; align?: string },
        ) => Promise<HTMLElement>
      }
    }
  }
}
