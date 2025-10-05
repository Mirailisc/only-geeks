import { useDebounce } from '@/hooks/useDebounce'
import { FileTextIcon, SearchIcon, UserIcon } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { SEARCH_SUGGEST_QUERY, type Search } from './../../graphql/search';
import { ScrollArea } from '../ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const debouncedSearch = useDebounce(searchQuery, 500)
  
  const skipQuery = debouncedSearch.length < 2
  const navigate = useNavigate();
  
  const {data, loading} = useQuery<{searchSuggest: Search}>(SEARCH_SUGGEST_QUERY, {
    variables: {
      input: { input: debouncedSearch }
    },
    skip: skipQuery
  })
  
  const {query} = useParams<{query: string}>()
  const [updatedQuery, setUpdatedQuery] = React.useState<boolean>(false)
  React.useEffect(()=>{
    if (query && query !== searchQuery && !updatedQuery) {
      setSearchQuery(query)
      setUpdatedQuery(true)
    }
  }, [query, searchQuery, updatedQuery])

  React.useEffect(() => {
    if (debouncedSearch && !skipQuery) {
      if (loading || (data && (data.searchSuggest.blogs.length > 0 || data.searchSuggest.users.length > 0))) {
        setIsPopoverOpen(true);
      } else if (data) {
        setIsPopoverOpen(false);
      }
    } else {
      setIsPopoverOpen(false);
    }
    
  }, [data, debouncedSearch, loading, skipQuery])

  // Function to handle the full search navigation when the user hits Enter
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsPopoverOpen(false);
      navigate(`/search/all/${searchQuery.trim()}`);
    }
  }

  const renderSuggestions = () => {
    if (loading) {
      return <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
    }

    if (!data?.searchSuggest || (data.searchSuggest.blogs.length === 0 && data.searchSuggest.users.length === 0)) {
      if (debouncedSearch && !loading) {
        return <div className="p-2 text-center text-sm text-muted-foreground">No results found for &ldquo;{debouncedSearch}&rdquo;</div>
      }
      return null;
    }

    const { blogs, users } = data.searchSuggest;

    return (
      <ScrollArea className="max-h-80">
        {blogs.length > 0 && (
          <div className="p-2">
            <h4 className="mb-1 px-2 text-xs font-semibold uppercase text-muted-foreground flex items-center">
              <FileTextIcon className="h-3 w-3 mr-2" />
              Blogs
            </h4>
            <div className="space-y-1">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.id}`} // Click goes to specific blog page
                  onClick={() => setIsPopoverOpen(false)} 
                  className="flex items-center space-x-2 rounded-md p-2 text-sm hover:bg-accent"
                >
                  <span className="truncate">{blog.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{blog.id}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {users.length > 0 && (
          <>
            {blogs.length > 0 && <div className="h-px bg-border my-1 mx-2" />} 
            
            <div className="p-2">
              <h4 className="mb-1 px-2 text-xs font-semibold uppercase text-muted-foreground flex items-center">
                <UserIcon className="h-3 w-3 mr-2" />
                Profiles
              </h4>
              <div className="space-y-1">
                {users.map((user) => (
                  <Link
                    key={user.id}
                    to={`/users/${user.username}`} // Click goes to specific user profile page
                    onClick={() => setIsPopoverOpen(false)}
                    className="flex items-center space-x-2 rounded-md p-2 text-sm hover:bg-accent"
                  >
                    <span className="truncate">@{user.username}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{user.firstName} {user.lastName[0].toUpperCase()}.</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </ScrollArea>
    );
  };

  return (
    <div className="flex-1 max-w-md mx-8">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            
            <Input
              data-cy="input-navbar-search"
              type="search"
              placeholder="Search for blogs or users..."
              className="w-full pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // Handle Enter key press for full search navigation
              onKeyDown={handleSearchSubmit} 
              aria-expanded={isPopoverOpen}
              aria-controls="search-suggestions"
              autoComplete="off"
            />
          </div>
        </PopoverTrigger>
        
        {isPopoverOpen && (
          <PopoverContent
            id="search-suggestions"
            className="w-[var(--radix-popover-trigger-width)] p-0 mt-1"
            align="start"
          >
            {renderSuggestions()}
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}

export default SearchBox