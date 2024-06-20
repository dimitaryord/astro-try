import type { APIRoute } from "astro"
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search"
import { ChatOpenAI } from "@langchain/openai"

export const POST: APIRoute = async ({ params, request }) => {
    const openai = new ChatOpenAI({ apiKey: import.meta.env.OPENAI_KEY,  })
    const result = []

    try{
        const body = await request.json()
        const tool = new DuckDuckGoSearch({ maxResults: 5 })
        const res = JSON.parse(await tool.invoke(body.search)) 

        for(let data of res) {
            const stream = await openai.stream(["human", `You are an ai that helps with users searching
             you will recieve in the next message a result from a search rework it adding your opinion
             and ideas make the most out of it but keep it short 10 sentences maximum`,
             "human", JSON.stringify(data)])

            result.push({
                title: data.title,
                link: data.link,
                content: ""
            })

            for await (const chunk of stream){
                result[result.length - 1].content = result[result.length - 1].content + chunk.content
            }
        }
    
        return new Response(JSON.stringify({
            result
        }))

    }
    catch(err){
        throw err
    }
}