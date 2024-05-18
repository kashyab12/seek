import { useContext, useEffect, useRef } from "react";
import { WindowCtx, Focus, FocusStateCtx } from "@/components/ui/compctx";
import { Button } from "@/components/ui/button";

const MAX_SEARCH_RESULT = 5
const handleOnFocus = (event: React.FocusEvent<HTMLButtonElement>, windowFocus: Focus) => {
    console.log(`Focusing on ${windowFocus} => ${event}`)
}
const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, searchResult: string) => {
    const isOpenedApp = await window.electronHandler.openApp(searchResult)
    console.log(isOpenedApp)
}
const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, { windowFocus, setWindowFocus }: FocusStateCtx) => {
    console.log("res key down")
    if (windowFocus >= 0 && windowFocus < MAX_SEARCH_RESULT) {
        console.log(windowFocus)
        if (event.key.toLowerCase() === "arrowdown") {
            if (windowFocus == MAX_SEARCH_RESULT - 1) {
                setWindowFocus(-1)
            } else {
                setWindowFocus((windowFocus + 1) as Focus)
            }
        }
        else if (event.key.toLowerCase() === "arrowup") setWindowFocus((windowFocus - 1) as Focus)
    }
}

export function SearchResults() {
    const {
        searchResultCtx: { searchResults, setSearchResults },
        focusCtx: { windowFocus, setWindowFocus }
    } = useContext(WindowCtx)

    const resultFocusArr: Array<React.MutableRefObject<HTMLButtonElement>> = []
    for (let idx = 0; idx < MAX_SEARCH_RESULT; idx += 1) {
        resultFocusArr.push(useRef())
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
                <Button
                    ref={resultFocusArr[index]}
                    key={searchResult}
                    onClick={(event) => handleOnClick(event, searchResult)}
                    onFocus={(event) => handleOnFocus(event, windowFocus)}
                    onKeyDown={(event) => handleKeyDown(event, {windowFocus, setWindowFocus})}
                    size="sm">
                    {appIcon && <img src={appIcon} width={32} height={32} />}
                    {`${searchResult} - ${simScore}`}
                </Button>
            )
        })
    )
}