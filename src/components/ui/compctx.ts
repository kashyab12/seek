import { createContext } from "react";

interface ResultsStateCtx {
    searchResults: string[][];
    setSearchResults: React.Dispatch<React.SetStateAction<string[][]>>;
}

interface FocusStateCtx {
    windowFocus: number;
    setWindowFocus: React.Dispatch<React.SetStateAction<number>>;
}

export interface WindowStateCtx {
    searchResultCtx: ResultsStateCtx;
    focusCtx: FocusStateCtx
}

// export const SearchQueryCtx = createContext<string>("")
export const WindowCtx = createContext<WindowStateCtx>({
    searchResultCtx: {
        searchResults: [],
        setSearchResults: () => {}
    },
    focusCtx: {
        windowFocus: -1,
        setWindowFocus: () => {}
    }
})

