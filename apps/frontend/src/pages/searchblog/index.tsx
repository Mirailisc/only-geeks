import BlogSearchResults from '@/components/Search/SearchBlog'
import AuthNavbar from '@/components/utils/AuthNavbar'

export default function SearchBlog(){
    return (
        <div>
            <AuthNavbar/>
            <BlogSearchResults/>
        </div>
    )
}