import { useState } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { WindowCtx, WindowStateCtx, Focus } from "@/components/ui/compctx";
import { SearchResults } from "@/components/ui/searchresults";

export type ResultsState = [string[][], React.Dispatch<React.SetStateAction<string[][]>>]
export type FocusState = [Focus, React.Dispatch<React.SetStateAction<Focus>>]

export function SearchWindow() {
    const [searchResults, setSearchResults] = useState<string[][]>([])
    const [windowFocus, setWindowFocus] = useState<Focus>(-1)
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