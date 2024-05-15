import { Textarea } from "@/components/ui/textarea"
import { useContext, useState } from "react"
import { SearchResultsCtx } from "@/components/ui/searchctx"

export function SearchButton() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { searchResults, setSearchResults } = useContext(SearchResultsCtx)
    const handleChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSearchQuery(event.target.value)
        const searchResult = await window.electronHandler.toSeek(searchQuery)
        setSearchResults(searchResult)
    }
    return (
        <Textarea autoFocus={true} placeholder="Search for apps" onChange={handleChange} value={searchQuery} rows={1} />
    )
}
