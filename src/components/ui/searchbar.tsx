import { useContext, useState } from "react"
import { WindowCtx } from "@/components/ui/compctx"
import { CommandInput } from "@/components/ui/command"

export type QueryState = [string, React.Dispatch<React.SetStateAction<string>>]

const handleOnChange = async (searchValue: string, [, setSearchQuery]: QueryState, setSearchResults: React.Dispatch<React.SetStateAction<string[][]>>) => {
    setSearchQuery(searchValue)
    if (searchValue) {
        const searchResult = await window.electronHandler.toSeek(searchValue)
        setSearchResults(searchResult)
    } else {
        setSearchResults([])
    }
}

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const {
        searchResultCtx: { setSearchResults }
    } = useContext(WindowCtx)

    return (
        <CommandInput
            autoFocus={true}
            onValueChange={(searchValue) => handleOnChange(searchValue, [searchQuery, setSearchQuery], setSearchResults)}
            placeholder="seek" />
    )
}
