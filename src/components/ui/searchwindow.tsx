import { useState } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { WindowCtx, WindowStateCtx } from "@/components/ui/compctx";
import { SearchResults } from "@/components/ui/searchresults";

export function SearchWindow() {
    const [searchResults, setSearchResults] = useState<string[][]>([])
    const [windowFocus, setWindowFocus] = useState<number>(-1)
    const windowStateCtx: WindowStateCtx = {
        searchResultCtx: {
            searchResults,
            setSearchResults
        },
        focusCtx: {
            windowFocus,
            setWindowFocus
        }
    }
    return (
        <WindowCtx.Provider value={windowStateCtx}>
            <div className="grid w-full gap-2">
                <SearchBar />
                {
                    searchResults.length > 1 &&
                    <SearchResults />
                }
            </div>
        </WindowCtx.Provider >
    )
}