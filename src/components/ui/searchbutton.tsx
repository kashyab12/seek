import { Textarea } from "@/components/ui/textarea"
import { useContext, useState } from "react"
import { SearchResultsCtx } from "@/components/ui/searchctx"

function splitResult(searchResults: string): string[][] {
    let resultsArr: string[][] = []
    for (let searchResult of searchResults.split("\n")) {
        if (searchResult) {
            const [appName, simScore] = searchResult.split(": ")
            resultsArr.push([appName, simScore])
        }
    }
    return resultsArr
}

export function SearchButton() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const {searchResults, setSearchResults} = useContext(SearchResultsCtx)
    const handleChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSearchQuery(event.target.value)
        const searchResult = await window.electronHandler.toSeek(searchQuery)
        console.log(searchResult)
        setSearchResults(splitResult(searchResult))
    }
    return (
        <Textarea placeholder="Search for apps" onChange={handleChange} value={searchQuery} rows={1} />
    )
}
