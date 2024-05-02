import { useContext } from "react";
import { SearchResultsCtx } from "@/components/ui/searchctx";
import { Button } from "@/components/ui/button";

export function SearchResults() {
    const { searchResults } = useContext(SearchResultsCtx)
    return (
        searchResults.map((searchResultEntry: string[]) => {
            const [searchResult, simScore] = searchResultEntry
            return (
                <Button>
                    {`${searchResult} - ${simScore}`}
                </Button>
            )
        })
    )
}