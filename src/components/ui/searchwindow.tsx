import { useState } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { SearchResultsCtx } from "@/components/ui/searchctx";
import { SearchResults } from "@/components/ui/searchresults";

export function SearchWindow() {
    const [searchResults, setSearchResults] = useState<string[][]>([])
    return (
        <SearchResultsCtx.Provider value={{ searchResults, setSearchResults }}>
            <div className="grid w-full gap-2">
                <SearchBar />
                {
                    searchResults.length > 1 &&
                    <SearchResults />
                }
            </div>
        </SearchResultsCtx.Provider >
    )
}