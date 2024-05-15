import { useContext } from "react";
import { SearchResultsCtx } from "@/components/ui/searchctx";
import { Button } from "@/components/ui/button";

export function SearchResults() {
    const { searchResults } = useContext(SearchResultsCtx)
    const resultOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, searchResult: string) => {
        const isOpenedApp = await window.electronHandler.openApp(searchResult)
        console.log(isOpenedApp)
    }
    return (
        searchResults.map((searchResultEntry: string[], index: number) => {
            const [searchResult, simScore, appIcon] = searchResultEntry
            return (
                <Button key={index} onClick={(event) => resultOnClick(event, searchResult)} size="sm">
                    {appIcon && <img src={appIcon}/>}
                    {`${searchResult} - ${simScore}`}
                </Button>
            )
        })
    )
}