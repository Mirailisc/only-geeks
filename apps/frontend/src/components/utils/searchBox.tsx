import { useDebounce } from '@/hooks/useDebounce'
import { FileTextIcon, SearchIcon, UserIcon } from 'lucide-react'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { SEARCH_SUGGEST_QUERY, type Search } from './../../graphql/search'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const debouncedSearch = useDebounce(searchQuery, 500)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const skipQuery = debouncedSearch.length < 2
  const navigate = useNavigate()

  const { data, loading } = useQuery<{ searchSuggest: Search }>(SEARCH_SUGGEST_QUERY, {
    variables: {
      input: { input: debouncedSearch },
    },
    skip: skipQuery,
  })

  const { query } = useParams<{ query: string }>()
  const [updatedQuery, setUpdatedQuery] = React.useState<boolean>(false)

  // Sync state with URL parameter, and focus input if a query is present
  React.useEffect(() => {
    if (query && query !== searchQuery && !updatedQuery) {
      setSearchQuery(query)
      setUpdatedQuery(true)
      inputRef.current?.focus()
    }
  }, [query, searchQuery, updatedQuery])

  // Manage popover open state based on query results
  React.useEffect(() => {
    if (debouncedSearch && !skipQuery) {
      const shouldOpen =
        loading || (data && (data.searchSuggest.blogs.length > 0 || data.searchSuggest.users.length > 0))
      setIsPopoverOpen(Boolean(shouldOpen))
    } else {
      setIsPopoverOpen(false)
    }
  }, [data, debouncedSearch, loading, skipQuery])

  // Function to handle the full search navigation when the user hits Enter
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsPopoverOpen(false)
      navigate(`/search/${searchQuery.trim()}`)
    }
  }

  const handleSuggestionClick = () => {
    setIsPopoverOpen(false)
  }

  // Prevent popover from stealing focus
  const handlePopoverOpenChange = (open: boolean) => {
    // Only allow closing the popover, not opening it via clicks
    if (!open) {
      setIsPopoverOpen(false)
    }
  }

  const renderSuggestions = () => {
    if (loading) {
      return <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
    }

    if (!data?.searchSuggest || (data.searchSuggest.blogs.length === 0 && data.searchSuggest.users.length === 0)) {
      if (debouncedSearch && !loading) {
        return (
          <div className="p-2 text-center text-sm text-muted-foreground">
            No results found for &ldquo;{debouncedSearch}&rdquo;
          </div>
        )
      }
      return null
    }

    const { blogs, users } = data.searchSuggest

    return (
      <ScrollArea className="max-h-80">
        {blogs.length > 0 && (
          <div className="p-2">
            <h4 className="mb-1 flex items-center px-2 text-xs font-semibold uppercase text-muted-foreground">
              <FileTextIcon className="mr-2 h-3 w-3" />
              Blogs
            </h4>
            <div className="space-y-1">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.User.username}/${blog.slug}`}
                  onClick={handleSuggestionClick}
                  className="flex items-center space-x-2 rounded-md p-2 text-sm hover:bg-accent"
                >
                  <span className="truncate">{blog.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">by @{blog.User?.username}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {users.length > 0 && (
          <>
            {blogs.length > 0 && <div className="mx-2 my-1 h-px bg-border" />}

            <div className="p-2">
              <h4 className="mb-1 flex items-center px-2 text-xs font-semibold uppercase text-muted-foreground">
                <UserIcon className="mr-2 h-3 w-3" />
                Profiles
              </h4>
              <div className="space-y-1">
                {users.map((user) => (
                  <Link
                    key={user.id}
                    to={`/user/${user.username}`}
                    onClick={handleSuggestionClick}
                    className="flex items-center space-x-2 rounded-md p-2 text-sm hover:bg-accent"
                  >
                    <span className="truncate">@{user.username}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {user.firstName} {user.lastName[0].toUpperCase()}.
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </ScrollArea>
    )
  }

  return (
    <div className="mx-8 max-w-md flex-1">
      <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange} modal={false}>
        <PopoverTrigger asChild>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              data-cy="input-navbar-search"
              type="search"
              placeholder="Search for blogs or users..."
              className="w-full pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              aria-expanded={isPopoverOpen}
              aria-controls="search-suggestions"
              autoComplete="off"
              ref={inputRef}
              onFocus={() => {
                // Don't automatically open popover on focus
                // Let the useEffect handle it based on search results
              }}
            />
          </div>
        </PopoverTrigger>

        {isPopoverOpen && (
          <PopoverContent
            id="search-suggestions"
            className="mt-1 w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            onOpenAutoFocus={(e) => {
              // Prevent the popover from stealing focus when it opens
              e.preventDefault()
            }}
          >
            {renderSuggestions()}
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}

export default SearchBox
