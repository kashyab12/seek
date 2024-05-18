import { Textarea } from "@/components/ui/textarea"
import { useContext, useRef, useState } from "react"
import { WindowCtx } from "@/components/ui/compctx"

export function SearchBar() {
    const barFocus: React.MutableRefObject<HTMLTextAreaElement> = useRef()
    const [searchQuery, setSearchQuery] = useState<string>("")
    const {
        searchResultCtx: { searchResults, setSearchResults },
        focusCtx: { windowFocus, setWindowFocus }
    } = useContext(WindowCtx)
    const handleChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSearchQuery(event.target.value)
        if (event.target.value) {
            const searchResult = await window.electronHandler.toSeek(searchQuery)
            setSearchResults(searchResult)
        } else {
            setSearchResults([])
        }
    }
    const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (searchResults.length > 0 && windowFocus === -1) {
            if (event.key.toLowerCase() === "arrowdown") setWindowFocus(0)
            else if (event.key.toLowerCase() === "arrowup") setWindowFocus(4)
        }
        console.log(event.key)
    }

    return (
        <Textarea ref={barFocus} autoFocus={windowFocus === -1} placeholder="Search for apps" onChange={handleChange} onKeyDown={handleKeyDown} value={searchQuery} rows={1} />
    )
}
