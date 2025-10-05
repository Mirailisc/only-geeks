import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AuthNavbar from '@/components/utils/AuthNavbar'
import { useParams, useSearchParams } from 'react-router-dom'
type SearchType = 'all' | 'profiles' | 'blogs'
const convertToSearchType = (type: string): SearchType => {
  if (type === 'profiles' || type === 'blogs') return type
  return 'all'
}
export default function SearchQuery() {
  const { query } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  // Read page from query string (?page=)
  const page = searchParams.get('page') || '1'
  const type = convertToSearchType(searchParams.get('type') || 'all')

  const handleNextPage = () => {
    const nextPage = Number(page) + 1
    setSearchParams({ page: String(nextPage), type: type })
  }

  const handlePrevPage = () => {
    const prevPage = Math.max(1, Number(page) - 1)
    setSearchParams({ page: String(prevPage), type: type })
  }
  const handleChangeType = (newType: SearchType) => {
    // const newType = type === 'all' ? 'profiles' : type === 'profiles' ? 'blogs' : 'all'
    setSearchParams({ page: '1', type: newType })
  }

  return (
    <>
      <AuthNavbar />
      <p>Type: {type}</p>
      <p>Query: {query}</p>
      <p>Page: {page}</p>
      <div>
        <Button data-cy="btn-search-prev" onClick={handlePrevPage} disabled={Number(page) <= 1}>Previous</Button>
        <Button data-cy="btn-search-next" onClick={handleNextPage}>Next</Button>
      </div>
      <Tabs defaultValue={"all"}>
        <TabsList>
          <TabsTrigger data-cy="btn-search-all" value="all" onClick={() => handleChangeType('all')}>All</TabsTrigger>
          <TabsTrigger data-cy="btn-search-profiles" value="profiles" onClick={() => handleChangeType('profiles')}>Profiles</TabsTrigger>
          <TabsTrigger data-cy="btn-search-blogs" value="blogs" onClick={() => handleChangeType('blogs')}>Blogs</TabsTrigger>
        </TabsList>

      </Tabs>
    </>
  )
}
