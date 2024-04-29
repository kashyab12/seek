import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function SearchButton() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSearchQuery(event.target.value)
    }
    const handleSeekClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const searchResult = await window.electronHandler.toSeek(searchQuery)
        console.log(searchResult)
        console.log("clicked")
    }
    return (
        <div className="grid w-full gap-2">
            <Textarea placeholder="Search for apps" onChange={handleChange} value={searchQuery}  />
            <Button onClick={handleSeekClick}>Seek</Button>
        </div>
    )
}
