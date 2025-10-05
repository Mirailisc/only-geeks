import AuthNavbar from '@/components/utils/AuthNavbar'
import { useParams, useSearchParams } from 'react-router-dom'

export default function SearchQuery({ type }: { type: 'all' | 'blog' | 'profile' }) {
  const { query } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  // Read page from query string (?page=)
  const page = searchParams.get('page') || '1'

  const handleNextPage = () => {
    const nextPage = Number(page) + 1
    setSearchParams({ page: String(nextPage) })
  }

  const handlePrevPage = () => {
    const prevPage = Math.max(1, Number(page) - 1)
    setSearchParams({ page: String(prevPage) })
  }

  return (
    <>
      <AuthNavbar />
      <p>Type: {type}</p>
      <p>Query: {query}</p>
      <p>Page: {page}</p>

      <div style={{ marginTop: 10 }}>
        <button onClick={handlePrevPage} disabled={Number(page) <= 1}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </>
  )
}
