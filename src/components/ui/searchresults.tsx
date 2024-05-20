import { useContext, useRef } from "react";
import { WindowCtx } from "@/components/ui/compctx";
import { AppWindow } from "lucide-react"
import { CommandItem } from "@/components/ui/command"

const MAX_SEARCH_RESULT = 5
const handleOnSelect = async (searchResult: string) => {
    const isOpenedApp = await window.electronHandler.openApp(searchResult)
    console.log(isOpenedApp)
}

export function SearchResults() {
    const {
        searchResultCtx: { searchResults, setSearchResults },
    } = useContext(WindowCtx)

    const resultFocusArr: Array<React.MutableRefObject<HTMLButtonElement>> = []
    for (let idx = 0; idx < MAX_SEARCH_RESULT; idx += 1) {
        resultFocusArr.push(useRef())
    }

    return (
        searchResults.map((searchResultEntry: string[], index: number) => {
            const [searchResult, , appIcon] = searchResultEntry
            return (
                <CommandItem
                    key={searchResult}
                    onSelect={(searchVal) => handleOnSelect(searchVal)}
                    value={searchResult}>
                    {appIcon ? <img src={appIcon} width={32} height={32} className="m-1.5" /> : <AppWindow width={32} height={32} className="m-1.5" />}
                    {searchResult}
                </CommandItem>
            )
        })
    )

}