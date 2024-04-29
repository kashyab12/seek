import { useContext } from "react";
import { SearchResultsCtx } from "@/components/ui/searchctx";

export function SearchResults() {
    const {searchResults, setSearchResults} = useContext(SearchResultsCtx)
    return (
        <h1>Hello there.</h1>
    )
}