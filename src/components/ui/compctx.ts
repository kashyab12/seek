import { createContext } from "react";

export type Focus = -1 | 0 | 1 | 2 | 3 | 4

interface ResultsStateCtx {
    searchResults: string[][];
    setSearchResults: React.Dispatch<React.SetStateAction<string[][]>>;
}

export interface FocusStateCtx {
    windowFocus: Focus;
    setWindowFocus: React.Dispatch<React.SetStateAction<Focus>>;
}

export interface WindowStateCtx {
    searchResultCtx: ResultsStateCtx;
    focusCtx: FocusStateCtx
}

// export const SearchQueryCtx = createContext<string>("")
export const WindowCtx = createContext<WindowStateCtx>({
    searchResultCtx: {
        searchResults: [],
        setSearchResults: () => { }
    },
    focusCtx: {
        windowFocus: -1,
        setWindowFocus: () => { }
    }
})

