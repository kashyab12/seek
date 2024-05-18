import { Textarea } from "@/components/ui/textarea"
import { useContext, useEffect, useRef, useState } from "react"
import { WindowCtx } from "@/components/ui/compctx"
import { FocusState } from "@/components/ui/searchwindow"

export type QueryState = [string, React.Dispatch<React.SetStateAction<string>>]

const handleOnChange = async (event: React.ChangeEvent<HTMLTextAreaElement>, [searchQuery, setSearchQuery]: QueryState, setSearchResults: React.Dispatch<React.SetStateAction<string[][]>>) => {
    setSearchQuery(event.target.value)
    if (event.target.value) {
        const searchResult = await window.electronHandler.toSeek(searchQuery)
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
    const barFocus: React.MutableRefObject<HTMLTextAreaElement> = useRef()
    const [searchQuery, setSearchQuery] = useState<string>("")
    const {
        searchResultCtx: { searchResults, setSearchResults },
        focusCtx: { windowFocus, setWindowFocus }
    } = useContext(WindowCtx)

    useEffect(() =>{
        if (windowFocus == -1) {
            barFocus.current.focus()
        }
    }, [windowFocus])

    return (
        <Textarea
            ref={barFocus}
            autoFocus={windowFocus === -1}
            placeholder="Search for apps"
            onChange={(event) => handleOnChange(event, [searchQuery, setSearchQuery], setSearchResults)}
            onKeyDown={(event) => handleOnKeyDown(event, searchResults, [windowFocus, setWindowFocus])}
            value={searchQuery}
            rows={1} />
    )
}
