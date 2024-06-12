import { createContext } from "react";

interface ResultsStateCtx {
    searchResults: string[][];
    setSearchResults: React.Dispatch<React.SetStateAction<string[][]>>;
}

interface QueryStateCtx {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export interface WindowStateCtx {
    searchResultCtx: ResultsStateCtx;
    searchQueryCtx: QueryStateCtx;
}

// export const SearchQueryCtx = createContext<string>("")
export const WindowCtx = createContext<WindowStateCtx>({
    searchResultCtx: {
        searchResults: [],
        setSearchResults: () => undefined
    },
    searchQueryCtx: {
        searchQuery: "",
        setSearchQuery: () => undefined
    }
})

