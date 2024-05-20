import { Textarea } from "@/components/ui/textarea"
import { useContext, useEffect, useRef, useState } from "react"
import { WindowCtx } from "@/components/ui/compctx"
import { FocusState } from "@/components/ui/searchwindow"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

export type QueryState = [string, React.Dispatch<React.SetStateAction<string>>]

const handleOnChange = async (searchValue: string, [searchQuery, setSearchQuery]: QueryState, setSearchResults: React.Dispatch<React.SetStateAction<string[][]>>) => {
    setSearchQuery(searchValue)
    if (searchValue) {
        const searchResult = await window.electronHandler.toSeek(searchValue)
        setSearchResults(searchResult)
    } else {
        setSearchResults([])
    }
}

const handleOnKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>, searchResults: string[][], [windowFocus, setWindowFocus]: FocusState) => {
    console.log("bar key down")
    if (searchResults.length > 0 && windowFocus === -1) {
        if (event.key.toLowerCase() === "arrowdown") setWindowFocus(0)
        else if (event.key.toLowerCase() === "arrowup") setWindowFocus(4)
    }
}


export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const {
        searchResultCtx: { searchResults, setSearchResults },
        focusCtx: { windowFocus, setWindowFocus }
    } = useContext(WindowCtx)

    return (
        <CommandInput 
        autoFocus={true}
        onValueChange={(searchValue) => handleOnChange(searchValue, [searchQuery, setSearchQuery], setSearchResults)}
        placeholder="seek" />
    )
}
