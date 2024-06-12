import { useState } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { WindowCtx, WindowStateCtx } from "@/components/ui/compctx";
import { SearchResults } from "@/components/ui/searchresults";
import { Command, CommandList, CommandGroup, CommandEmpty } from "@/components/ui/command"
import { ThemeProvider } from "@/components/ui/theme-provider";
import { CommandItem } from "cmdk";

export type ResultsState = [string[][], React.Dispatch<React.SetStateAction<string[][]>>]

export function SearchWindow() {
    const [searchResults, setSearchResults] = useState<string[][]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const windowStateCtx: WindowStateCtx = {
        searchResultCtx: {
            searchResults,
            setSearchResults
        },
        searchQueryCtx: {
            searchQuery,
            setSearchQuery
        }
    }
    return (
        <ThemeProvider defaultTheme="dark">
            <WindowCtx.Provider value={windowStateCtx}>
                <Command loop={true}>
                    <SearchBar />
                    <CommandList>
                        <CommandEmpty>
                            cool
                        </CommandEmpty>
                        {
                            
                            searchResults.length > 1 &&
                            <CommandGroup heading="Apps">
                                <SearchResults />
                            </CommandGroup>
                        }
                    </CommandList>
                </Command>
            </WindowCtx.Provider >
        </ThemeProvider>
    )
}