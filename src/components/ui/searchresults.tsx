import { useContext } from "react";
import { SearchResultsCtx } from "@/components/ui/searchctx";
import { Button } from "@/components/ui/button";

export function SearchResults() {
    const { searchResults } = useContext(SearchResultsCtx)
    return (
        {searchResults.length > 1 && searchResults.map((searchResult: string[]) => {
            return (
                <Button>
                    searchResult[0]
                </Button>
            )
        })}
    )
}