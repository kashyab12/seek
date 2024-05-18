import { useContext, useEffect, useRef } from "react";
import { WindowCtx } from "@/components/ui/compctx";
import { Button } from "@/components/ui/button";

const MAX_SEARCH_RESULT = 5

export function SearchResults() {
    const {
        searchResultCtx: { searchResults, setSearchResults },
        focusCtx: { windowFocus, setWindowFocus }
    } = useContext(WindowCtx)
    const resultOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, searchResult: string) => {
        const isOpenedApp = await window.electronHandler.openApp(searchResult)
        console.log(isOpenedApp)
    }
    const resultFocusArr: Array<React.MutableRefObject<HTMLButtonElement>> = []
    for (let idx = 0; idx < MAX_SEARCH_RESULT; idx += 1) {
        resultFocusArr.push(useRef())
    }
    const handleOnFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
        console.log(`Focusing on ${windowFocus} => ${event}`)
    }

    useEffect(() => {
        if (windowFocus >= 0) {
            resultFocusArr[windowFocus].current.focus()
        }
    }, [windowFocus])
    return (
        searchResults.map((searchResultEntry: string[], index: number) => {
            const [searchResult, simScore, appIcon] = searchResultEntry
            return (
                <Button ref={resultFocusArr[index]} key={searchResult} onClick={(event) => resultOnClick(event, searchResult)} onFocus={handleOnFocus} size="sm">
                    {appIcon && <img src={appIcon} width={32} height={32} />}
                    {`${searchResult} - ${simScore}`}
                </Button>
            )
        })
    )
}