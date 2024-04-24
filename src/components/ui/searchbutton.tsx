import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function SearchButton() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSearchQuery(event.target.value)
    }
    const handleSeekClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("clicked")
    }
    return (
        <div className="grid w-full gap-2">
            <Textarea placeholder="Search for apps" onChange={handleChange} value={searchQuery}  />
            <Button onClick={handleSeekClick}>Seek</Button>
        </div>
    )
}
