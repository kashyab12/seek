import { useContext } from "react";
import { SearchResultsCtx } from "@/components/ui/searchctx";
import { Button } from "@/components/ui/button";

export function SearchResults() {
    const { searchResults, setSearchResults } = useContext(SearchResultsCtx)
    return (
        searchResults.map((searchResult: string[]) => {
            return (
                <Button>
                    searchResult[0]
                </Button>
            )
        })
    )
}