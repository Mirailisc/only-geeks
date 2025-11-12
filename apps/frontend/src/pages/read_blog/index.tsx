import BlogCard from '@/components/blog/blogCard'
import MarkdownViewer from '@/components/blog/markdownViewer'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import AuthNavbar from '@/components/utils/AuthNavbar'
import { Loading } from '@/components/utils/loading'
import Meta from '@/components/utils/metadata'
import { CREATE_BLOG_PATH, FEED_PATH } from '@/constants/routes'
import { BLOG_READ_QUERY, type Blog } from '@/graphql/blog'
import type { Profile } from '@/graphql/profile'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useQuery } from '@apollo/client/react'
import { HomeIcon, PencilIcon, TriangleAlertIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

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
  if (error){
    if(error.message === 'BLOG_NOT_FOUND'){
      return (
        <>
          <AuthNavbar />
          <div className="w-full flex flex-row items-center justify-center h-[80vh]">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TriangleAlertIcon />
                </EmptyMedia>
                <EmptyTitle>Blog Not Found</EmptyTitle>
                <EmptyDescription>
                  The blog you are looking for does not exist or is not published.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <Link to={CREATE_BLOG_PATH}><Button variant={"default"}><PencilIcon /> Write new blog</Button></Link>
                  <Link to={FEED_PATH}><Button variant="outline"><HomeIcon /> Go to home</Button></Link>
                </div>
              </EmptyContent>
            </Empty>
          </div>
        </>
      )
    }
    return <div>Error: {error.message}</div>
  } 
    
  return (
    <>
      <Meta
        title={`${data?.getBlogBySlugAndUsername.title} | ${data?.getBlogBySlugAndUsername?.User?.username}'s Blog`}
        description={data?.getBlogBySlugAndUsername.description || 'Read this blog on Only Geeks.'}
        keywords={`blog, ${data?.getBlogBySlugAndUsername.title || ''}, ${data?.getBlogBySlugAndUsername.User.username || ''}`}
        image={data?.getBlogBySlugAndUsername.thumbnail || ''}
        url={window.location.href}
      />
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
