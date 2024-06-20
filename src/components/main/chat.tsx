import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect, useCallback } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import New from "@/components/main/new"
import axios from "axios"

type NewType = {
    title: string, link: string, content: string
}

function Chat() {
    const inputRef = useRef<HTMLInputElement>(null)
    const [searches, setSearches] = useState<Array<NewType>>([])
    const [loading, setLoading] = useState<boolean>(false)


    const searchWithAI = useCallback(async () => {
        try {
            const search = inputRef.current!.value
            inputRef.current!.value = ""
            setLoading(true)

            const data: { data: { result: Array<NewType> } } = await axios.post("/api/search", {
                search: search
            })
            console.log(data)

            setSearches(data.data.result)
            setLoading(false)

        }
        catch (err) {
            console.error(err)
        }
    }, [])

    useEffect(() => {
        const actionPress = async (e: KeyboardEvent) => {
            if (e.key == "Enter") {
                await searchWithAI()
            }
        }

        window.addEventListener("keydown", actionPress)

        return () => window.removeEventListener("keydown", actionPress)
    }, [])

    return (
        <section>
            <div className="flex space-x-2 p-5">
                <Input ref={inputRef} placeholder="Search"></Input>
                <Button onClick={async () => {
                    await searchWithAI()
                }}>Search</Button>
            </div>
            <div className="space-y-5">
                {searches.length > 0 && !loading ? searches.map(search => {
                    return <New key={`search-${search.link}`}
                        title={search.title}
                        link={search.link}
                        content={search.content} />
                }) : loading ?
                    <>
                        <Skeleton className="w-full h-52" />
                        <Skeleton className="w-full h-52" />
                        <Skeleton className="w-full h-52" />
                        <Skeleton className="w-full h-52" />
                        <Skeleton className="w-full h-52" />
                    </>
                    : null}
            </div>
        </section>
    )
}

export default Chat