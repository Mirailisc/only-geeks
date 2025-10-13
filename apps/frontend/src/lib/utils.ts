import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractMarkdownContent(markdown: string): { firstImage: string | null; plainText: string } {
  // Extract first image link (both ![alt](url) and <img src="url"> formats)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/i;
  
  const markdownImageMatch = markdown.match(markdownImageRegex);
  const htmlImageMatch = markdown.match(htmlImageRegex);
  
  const firstImage = markdownImageMatch?.[1] || htmlImageMatch?.[1] || null;
  
  // Remove markdown syntax to get plain text
  let plainText = markdown
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links but keep text
    // eslint-disable-next-line no-useless-escape
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove headings
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^(\*{3,}|-{3,}|_{3,})$/gm, '')
    // Remove list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  // Get first 1000 characters
  plainText = plainText.substring(0, 1000);
  // remove /n and replace with space
  plainText = plainText.replace(/\n/g, ' ');
  
  return { firstImage, plainText };
}

export function dateFormatter(dateString: string, includeTime: boolean = false): string {
  const formattedDate = new Date(dateString);
  return formattedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + (includeTime ? ` ${formattedDate.toLocaleTimeString()}` : '');
}