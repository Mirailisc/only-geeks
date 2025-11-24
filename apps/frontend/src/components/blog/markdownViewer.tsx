/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { useEffect, useRef } from 'react'
import { slugify } from '@/lib/utils'

type Props = {
  content?: string
  className?: string
}

export default function LexicalViewer({ content = '', className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !content) return

    try {
      const editorState = JSON.parse(content)
      const html = lexicalToHtml(editorState)
      containerRef.current.innerHTML = html

      // --- YouTube embeds ---
      const youtubePlaceholders = containerRef.current.querySelectorAll('[data-youtube-id]')
      youtubePlaceholders.forEach((placeholder) => {
        const id = placeholder.getAttribute('data-youtube-id')
        if (id) {
          const wrapper = document.createElement('div')
          wrapper.className = 'my-4 w-full flex flex-col items-center'
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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error parsing Lexical JSON:', error)
      containerRef.current.innerHTML = '<p>Error rendering content</p>'
    }
  }, [content])

  return (
    <div 
      ref={containerRef} 
      className={className ?? 'prose dark:text-white prose-no-backticks prose-no-m w-full !max-w-full px-6'}
    />
  )
}

function lexicalToHtml(editorState: any): string {
  if (!editorState?.root) return ''
  // eslint-disable-next-line no-console
  console.log('Lexical Editor State:', editorState.root)
  return processNode(editorState.root)
}

function processNode(node: any): string {
  if (!node) return '';

  const children = node.children || [];
  const childrenHtml = children.map((child: any) => processNode(child)).join('');

  switch (node.type) {
    /** ROOT */
    case 'root':
      return childrenHtml;

    /** PARAGRAPH */
    case 'paragraph': {
      let style = node.textStyle || "";
      const format = node.format || 0;

      // append text alignment from format to style
      style += format === "center" ? "text-align:center;" : "";
      style += format === "right" ? "text-align:right;" : "";
      style += format === "justify" ? "text-align:justify;" : "";
      style += format === "left" ? "text-align:left;" : "";

      // --- SINGLE-SPAN CHECK ---
      let out = childrenHtml;

      // match exactly ONE span as the entire childrenHtml
      const singleSpanRegex = /^<span([^>]*)>(.*?)<\/span>$/s;
      const match = childrenHtml?.match(singleSpanRegex);

      if (match) {
        const attr = match[1];      // attributes inside <span ...>
        const inner = match[2];     // text/content inside span

        // check if style contains background-color
        const hasBackground =
          /background(?:-color)?\s*:/i.test(attr || "");

        if (!hasBackground) {
          // Remove the style="" entirely
          const cleanedAttr = attr
            .replace(/\s*style\s*=\s*"(.*?)"/, "")   // remove style=""
            .replace(/\s*style\s*=\s*'(.*?)'/, ""); // remove style=''

          // ensure <span> or <span >
          out = `<span${cleanedAttr}>${inner}</span>`;
        }
      }

      return `<p style="${style}">${out || ""}</p>`;
    }

    /** HEADINGS */
    case 'heading': {
      const tag = node.tag || 'h1';
      const text = getTextContent(node);
      const id = slugify(text);
      let style = node.textStyle || ""
      const format = node.format || 0 // center | justify | left | right
      // append text alignment from format to style
      style += format === "center" ? "text-align:center;" : ""
      style += format === "right" ? "text-align:right;" : ""
      style += format === "justify" ? "text-align:justify;" : ""
      style += format === "left" ? "text-align:left;" : ""
      return `<${tag} id="${id}" style="${style}" class="scroll-mt-24"><a href="#${id}" class="no-underline hover:underline dark:text-white">${childrenHtml}</a></${tag}>`;
    }

    /** LISTS */
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      return `<${tag}>${childrenHtml}</${tag}>`;
    }

    case 'listitem':{
      let style = node.textStyle || ""
      const format = node.format || 0 // center | justify | left | right
      // append text alignment from format to style
      style += format === "center" ? "text-align:center;" : ""
      style += format === "right" ? "text-align:right;" : ""
      style += format === "justify" ? "text-align:justify;" : ""
      style += format === "left" ? "text-align:left;" : ""
      return `<li style="${style}">${childrenHtml}</li>`;
    }

    /** QUOTE */
    case 'quote':
      return `<blockquote>${childrenHtml}</blockquote>`;

    /** HASHTAG */
    case 'hashtag': {
      const text = node.text;
      return `<div class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent bg-blue-100 text-blue-600 [a&]:hover:bg-blue-200/90">${text}</div>`;
    }

    /** CODE */
    case 'code': {
      const language = node.language || '';
      return `<pre><code class="language-${language}">${escapeHtml(node.children.map((i: { text: any })=>i.text).join('') || '')}</code></pre>`;
    }

    /** CODE HIGHLIGHT (inline) */
    case 'code-highlight':
      return `<code>${escapeHtml(node.text || '')}</code>`;

    /** TEXT */
    case 'text': {
      let text = escapeHtml(node.text || '');
      let style = node.textStyle || ""
      const format = node.format || 0 // center | justify | left | right
      // append text alignment from format to style
      style += format === "center" ? "text-align:center;" : ""
      style += format === "right" ? "text-align:right;" : ""
      style += format === "justify" ? "text-align:justify;" : ""
      style += format === "left" ? "text-align:left;" : ""
      if (node.format) {
        if (node.format & 1) text = `<strong style="${style}">${text}</strong>`;
        if (node.format & 2) text = `<em style="${style}">${text}</em>`;
        if (node.format & 4) text = `<s style="${style}">${text}</s>`;
        if (node.format & 8) text = `<u style="${style}">${text}</u>`;
        if (node.format & 16) text = `<code style="${style}">${text}</code>`;
        if (node.format & 32) text = `<sub style="${style}">${text}</sub>`;
        if (node.format & 64) text = `<sup style="${style}">${text}</sup>`;
      }
      return `<span style="${style}">${text}</span>`;
    }

    /** LINKS */
    case 'link':
    case 'autolink':
      return `<a href="${escapeHtml(node.url || '#')}" style="color:blue;" target="${node.target || '_blank'}">${childrenHtml}</a>`;

    /** LINE BREAK */
    case 'linebreak':
      return '<br>';

    /** IMAGES */
    case 'image':
      return `<img src="${escapeHtml(node.src || '')}" alt="${escapeHtml(node.altText || '')}" />`;

    /** HORIZONTAL RULE */
    case 'horizontalrule':
      return '<hr style="height:1px;border:none;background-color:#ccc;" />';

    /** TWEET */
    case 'tweet':
      return `<div data-tweet-id="${escapeHtml(node.id || '')}"></div>`;

    /** YOUTUBE */
    case 'youtube':
      return `<div data-youtube-id="${escapeHtml(node.videoID || '')}"></div>`;

    /** TABLES */
    case 'table':
      return `<table>${childrenHtml}</table>`;

    case 'tablerow':
      return `<tr>${childrenHtml}</tr>`;

    case 'tablecell': {
      const tag = node.header ? 'th' : 'td';
      return `<${tag}>${childrenHtml}</${tag}>`;
    }

    /** MENTION */
    case 'mention':
      return `<span class="mention">@${escapeHtml(node.name || '')}</span>`;

    /** EMOJI */
    case 'emoji':
      return `${escapeHtml(node.emoji || '')}`;

    /** KEYWORD (custom semantic tag) */
    case 'keyword':
      return `<span class="keyword">${childrenHtml}</span>`;

    /** AUTOCOMPLETE NODE */
    case 'autocomplete':
      return `<span class="autocomplete">${childrenHtml}</span>`;

    /** LAYOUT CONTAINER (editor-only structural) */
    case 'layout-container':{
      const template_columns = node.templateColumns || ''
      return `<div class="layout-container" style="display:grid;grid-template-columns: ${template_columns}">${childrenHtml}</div>`;
    }

    case 'layout-item':
      return `<div class="layout-item">${childrenHtml}</div>`;

    /** OVERFLOW NODE — usually invisible */
    case 'overflow':
      return childrenHtml;

    /** DEFAULT */
    default:
      return childrenHtml;
  }
}

function getTextContent(node: any): string {
  if (node.type === 'text') return node.text || ''
  if (!node.children) return ''
  return node.children.map((child: any) => getTextContent(child)).join('')
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
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