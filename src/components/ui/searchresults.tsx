import { useContext } from "react";
import { SearchResultsCtx } from "@/components/ui/searchctx";
import { Button } from "@/components/ui/button";

export function SearchResults() {
    const { searchResults } = useContext(SearchResultsCtx)
    const resultOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, searchResult: string) => {
        console.log(searchResult)
    }
    return (
        searchResults.map((searchResultEntry: string[], index: number) => {
            const [searchResult, simScore] = searchResultEntry
            return (
                <Button key={index} onClick={(event) => resultOnClick(event, searchResult)}>
                    {`${searchResult} - ${simScore}`}
                </Button>
            )
        })
    )
}