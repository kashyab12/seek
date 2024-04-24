import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function SearchButton() {
    return (
        <div className="grid w-full gap-2">
            <Textarea placeholder="Search for apps" />
        </div>
    )
}
