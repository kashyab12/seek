import { createContext } from "react";

type ResultsStateCtx = {
    searchResults: string[][];
    setSearchResults: React.Dispatch<React.SetStateAction<string[][]>>;
}

export const SearchQueryCtx = createContext<string>("")
export const SearchResultsCtx = createContext<ResultsStateCtx>({
    searchResults: [],
    setSearchResults: () => {}
})