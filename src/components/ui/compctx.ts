import { createContext } from "react";

interface ResultsStateCtx {
    searchResults: string[][];
    setSearchResults: React.Dispatch<React.SetStateAction<string[][]>>;
}

export interface WindowStateCtx {
    searchResultCtx: ResultsStateCtx;
}

// export const SearchQueryCtx = createContext<string>("")
export const WindowCtx = createContext<WindowStateCtx>({
    searchResultCtx: {
        searchResults: [],
        setSearchResults: () => { }
    }
})

