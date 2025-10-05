import SearchResults from '@/components/Search/SearchStudents'
import AuthNavbar from '@/components/utils/AuthNavbar'

export default function SearchStudent(){
    return (
        <div>
            <AuthNavbar/>
            <SearchResults/>
        </div>
    )
}