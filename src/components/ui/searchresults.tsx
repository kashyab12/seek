import { useContext } from "react";
import { WindowCtx } from "@/components/ui/compctx";
import { Button } from "@/components/ui/button";

export function SearchResults() {
    const {
        searchResultCtx: { searchResults, setSearchResults },
        focusCtx: { windowFocus, setWindowFocus }
    } = useContext(WindowCtx)
    const resultOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, searchResult: string) => {
        const isOpenedApp = await window.electronHandler.openApp(searchResult)
        console.log(isOpenedApp)
    }
    return (
        searchResults.map((searchResultEntry: string[], index: number) => {
            const [searchResult, simScore, appIcon] = searchResultEntry
            return (
                <Button key={index} onClick={(event) => resultOnClick(event, searchResult)} size="sm">
                    {appIcon && <img src={appIcon} width={32} height={32} />}
                    {`${searchResult} - ${simScore}`}
                </Button>
            )
        })
    )
}