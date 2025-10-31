import BlogCard from '@/components/blog/blogCard'
import MarkdownViewer from '@/components/blog/markdownViewer'
import AuthNavbar from '@/components/utils/AuthNavbar'
import { Loading } from '@/components/utils/loading'
import { BLOG_READ_QUERY, type Blog } from '@/graphql/blog'
import type { Profile } from '@/graphql/profile'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router-dom'

const ReadBlog = () => {
  const { username, slug: blogSlug } = useParams()
  const { user } = useAppSelector((state) => state.auth)
  const { data, loading, error } = useQuery<{ getBlogBySlugAndUsername: Partial<Blog> & { User: Partial<Profile> } }>(
    BLOG_READ_QUERY,
    {
      variables: {
        username: username,
        slug: blogSlug,
      },
      skip: !username || !blogSlug,
    },
  )
  if (loading) return <Loading />
  if (error) return <div>Error: {error.message}</div>
  return (
    <>
      <AuthNavbar />
      <div className="mx-auto flex w-full flex-col gap-4 md:w-[85vw]">
        <BlogCard
          myUsername={user?.username || ''}
          blogId={data?.getBlogBySlugAndUsername.id || ''}
          user={data?.getBlogBySlugAndUsername.User || {}}
          description={data?.getBlogBySlugAndUsername.description || ''}
          title={data?.getBlogBySlugAndUsername.title || ''}
          updatedAt={data?.getBlogBySlugAndUsername.updatedAt || ''}
          content={data?.getBlogBySlugAndUsername.content || ''}
          isPublished={data?.getBlogBySlugAndUsername.isPublished || false}
        />
        <MarkdownViewer content={data?.getBlogBySlugAndUsername.content || ''} />
      </div>
    </>
  )
}

export default ReadBlog
