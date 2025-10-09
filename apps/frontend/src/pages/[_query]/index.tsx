import StudentBlogCard from '@/assets/search/StudentBlogCard'
import StudentProfileCard from '@/assets/search/StudentProfileCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AuthNavbar from '@/components/utils/AuthNavbar'
import { SEARCH_QUERY, type Search } from '@/graphql/search'
import { cn } from '@/lib/utils'
import { useQuery } from '@apollo/client/react'
import { useParams, useSearchParams } from 'react-router-dom'

export type SearchType = 'all' | 'profiles' | 'blogs'

const convertToSearchType = (type: string): SearchType => {
  if (type === 'profiles' || type === 'blogs') return type
  return 'all'
}

export default function SearchQuery() {
  const { query } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const type = convertToSearchType(searchParams.get('type') || 'all')
  const {data, loading} = useQuery<{search: Search}>(SEARCH_QUERY, {
    variables: {
      input: { input: query }
    }
  })
  const handleChangeType = (newType: SearchType) => {
    setSearchParams({ type: newType })
  }
  const BlogContentResults = ({result} : {result: {search: Search}}) => {
    if(result.search.blogs.length === 0) return null
    return (
      <>
        <h2 className='font-bold my-2 text-lg'>Blogs</h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          {result.search.blogs.map(blog => (
            <StudentBlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </>
    )
  }
  const ProfileContentResults = ({result} : {result: {search: Search}}) => {
    if(result.search.users.length === 0) return null
    return (
      <>
        <h2 className='font-bold my-2 text-lg'>Profiles</h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          {result.search.users.map(profile => (
            <StudentProfileCard key={profile.id} student={profile} />
          ))}
        </div>
      </>
    )
  }
  return (
    <>
      <AuthNavbar />
      <div className='container mx-auto mt-4'>
        <div className='text-xl font-semibold'>Found {(data?.search.blogs?.length ?? 0) + (data?.search.users?.length ?? 0)} results for &ldquo;{query}&rdquo;</div>
        <Tabs defaultValue={type}>
          <TabsList className="w-full">
            <TabsTrigger 
              className="w-full" 
              data-cy="btn-search-all" 
              value="all" 
              onClick={() => handleChangeType('all')}
            >
              All ({(data?.search.blogs?.length ?? 0) + (data?.search.users?.length ?? 0)})
            </TabsTrigger>
            <TabsTrigger 
              className={cn("w-full", data?.search.users?.length === 0 && "hidden")}
              data-cy="btn-search-profiles" 
              value="profiles" 
              onClick={() => handleChangeType('profiles')}
            >
              Profiles ({data?.search.users?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger 
              className={
                cn("w-full", data?.search.blogs?.length === 0 && "hidden")
              } 
              data-cy="btn-search-blogs" 
              value="blogs" 
              onClick={() => handleChangeType('blogs')}
            >
              Blogs ({data?.search.blogs?.length ?? 0})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {loading && <p>Loading...</p>}
            {data && !loading && (
              <>
                <ProfileContentResults result={data} />
                <BlogContentResults result={data} />
              </>
            )}
          </TabsContent>
          <TabsContent value="profiles">
            {loading && <p>Loading...</p>}
            {data && !loading && <ProfileContentResults result={data} />}
          </TabsContent>
          <TabsContent value="blogs">
            {loading && <p>Loading...</p>}
            {data && !loading && <BlogContentResults result={data} />}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
