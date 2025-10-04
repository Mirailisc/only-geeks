import React, { useState } from 'react';
import { Calendar, PencilIcon } from 'lucide-react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- TYPE DEFINITIONS ---

// 1. Type สำหรับข้อมูล Blog Post แต่ละรายการ
interface Post {
  id: number;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
}

// 2. Type สำหรับ Props ของ BlogPostCard
interface BlogPostCardProps {
  post: Post;
}

// --- MOCK DATA ---
const MOCK_BLOG_POSTS: Post[] = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    summary: "Learn the fundamentals of React Hooks and how they can simplify your component logic.",
    date: "1/1/2024",
    imageUrl: "https://placehold.co/400x300/e0f2fe/0c4a6e?text=Mock+Image", // Placeholder image URL
  },
  {
    id: 2,
    title: "Understanding Tailwind CSS Utility-First",
    summary: "A deep dive into why the utility-first approach revolutionizes modern web development workflows.",
    date: "3/15/2024",
    imageUrl: "https://placehold.co/400x300/f0f9ff/0369a1?text=Tailwind+CSS",
  },
  {
    id: 3,
    title: "The Power of Monorepos with pnpm",
    summary: "Explore how monorepos and pnpm workspaces streamline large-scale project management and dependency handling.",
    date: "6/20/2024",
    imageUrl: "https://placehold.co/400x300/f0f9ff/075985?text=Monorepo+Setup",
  },
];

// Component for a single blog post card
const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6 pb-1">
        {/* items-stretch เพื่อให้คอลัมน์ซ้ายและขวามีความสูงเท่ากัน */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          
          {/* LEFT: Text Area  */}
          <div className="flex-1 order-2 md:order-1 flex flex-col justify-between">
            
            {/* Top: Title + Summary */}
            <div>
              <CardTitle className="text-2xl font-bold mb-2 leading-snug">
                {post.title}
              </CardTitle>
              <p className="text-gray-600 mb-4 text-base">
                {post.summary}
              </p>
            </div>

            {/* Bottom: Date */}
            <p className="text-sm text-gray-500 flex items-center mt-4 self-start">
              <Calendar className="w-4 h-4 mr-1.5 text-blue-500" />
              {post.date}
            </p>
          </div>

          <div className="w-full md:w-56 flex flex-col flex-shrink-0 order-1 md:order-2 justify-between">
            
            {/* Image */}
            <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
              <img
                src={post.imageUrl}
                alt={`Image for ${post.title}`}
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://placehold.co/400x300/cccccc/333333?text=Error';
                }}
              />
            </div>

            {/* Read more button */}
            <Button
              className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200"
              onClick={() => {  }}
            >
              Read more
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main container component
const ProfileBlog: React.FC = () => {
  const [posts] = useState<Post[]>(MOCK_BLOG_POSTS);

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Blog Header and Action Button */}
        <div className="flex justify-between items-center pt-4">
          <h1 className="text-3xl text-gray-900 font-bold">Blog Posts</h1>
          <Button
            variant={"default"}
            size={"sm"}
            className="bg-gray-900 text-white hover:bg-gray-700" 
            onClick={() => {  }}
          >
            <PencilIcon className='w-4 h-4' />
            Write blog
          </Button>
        </div>

        {/* List of Blog Posts */}
        <div className="space-y-6 pt-4">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default ProfileBlog;
