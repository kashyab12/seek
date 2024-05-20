import { useState } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { WindowCtx, WindowStateCtx } from "@/components/ui/compctx";
import { SearchResults } from "@/components/ui/searchresults";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command"

export type ResultsState = [string[][], React.Dispatch<React.SetStateAction<string[][]>>]

export function SearchWindow() {
    const [searchResults, setSearchResults] = useState<string[][]>([])
    const windowStateCtx: WindowStateCtx = {
        searchResultCtx: {
            searchResults,
            setSearchResults
        }
    }
    return (
        <WindowCtx.Provider value={windowStateCtx}>
            <Command loop={true}>
                <SearchBar />
                <CommandList>
                    <CommandEmpty></CommandEmpty>
                    {
                        searchResults.length > 1 &&
                        <CommandGroup heading="Apps">
                            <SearchResults />
                        </CommandGroup>
                    }
                </CommandList>
            </Command>
        </WindowCtx.Provider >
    )
}