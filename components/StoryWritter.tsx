'use client'
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { useState } from 'react'
import type { Frame } from "@gptscript-ai/gptscript"
import renderEventMessage from "@/lib/renderEventMessage"

const storiesPath = "public/stories"
const StoryWritter = () => {

  const [story, setStory] = useState<string>("")
  const [pages, setPages] = useState<number>(1)
  const [progress , setProgress] = useState("")
  const [runStarted , setRunStarted] = useState<boolean>(false)
  const [runFinished , setRunFinished] = useState<boolean | null>(false)
  const [currentTool , setCurrentTool] = useState("")
  const [events , setEvents] = useState<Frame[]>()


  async function runScript(){
    setRunStarted(true)
    setRunFinished(false)
    try{
      const response = await fetch(`/api/run-script`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({story,pages , path:storiesPath})
      })

      if(response.ok && response.body){

        console.log("Streaming started")
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        await handleStream(reader , decoder);
      
      }else{
        console.error("Error fetching response", response)
        setRunFinished(true)
        setRunStarted(false)
      }
    }catch(error){
      console.error("Error running script", error)
      setRunFinished(true)
    
    }
  }

  async function handleStream(reader:ReadableStreamDefaultReader<Uint8Array> , decoder:TextDecoder){
    while(true){
      const {value , done} = await reader.read();
      if(done){
        break ;
      }

      const chunks = decoder.decode(value , {stream : true} );
      const eventData = chunks.split("\n\n").filter((line)=>line.startsWith("event: ")).map((line)=>line.replace(/^event: /, ""));
      eventData.forEach(data => {
        try{
            const parseData = JSON.parse(data);
            console.log("ParseData" , parseData)
            if(parseData.type === "callProgress"){
              setProgress(
                parseData.output[parseData.output.length - 1].content
              )
              setCurrentTool(parseData.tool?.description || "")
            }else if(parseData.type === "calStart"){
              setCurrentTool(parseData.tool?.description || "")
            }else if(parseData.type === 'runFinished'){
              setRunFinished(true)
              setRunStarted(false)
            }else{
              setEvents((prevEvents) => [...(prevEvents || []), parseData])
            }
        }catch(error){
                console.error("Error parsing event data", error)
    
        }
      })
    }
  }
  return (
    <div className="flex flex-col w-[100%] mr-auto ml-auto pr-[2rem] pl-[2rem] " >
      <section className="flex flex-col border border-purple-300 rounded-md p-10 space-y-2"  >
        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className=" text-black" rows={5} placeholder="Write a story here..."

        />
        <Select onValueChange={(value) => setPages(parseInt(value))}  >
          <SelectTrigger>
            <SelectValue placeholder="how many pages should the story be ?" />
          </SelectTrigger>
          <SelectContent className="w-full " >
            {
              Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i} value={String(i + 1)} >{i + 1}</SelectItem>
              ))
            }
          </SelectContent>

        </Select>

        <Button disabled={!story || !pages || runStarted} className="" size="lg" onClick={runScript} >
          <span> Generaye Story </span>
        </Button>
      </section>
      <section className="flex-1 pb-5 mt-5" >
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-medium font-mono p-10 h-96
              overflow-y-auto
              " >
                <div className="">
                  {
                    runFinished === null && (
                     <>
                     <p className="animate-pulse mr-5" >Im waiting for you to Generate a story above...</p>
                     </>
                    ) 
                  }
                  <span className="mr-5" >{">>"}</span>
                 { progress}
                </div>

                {currentTool && (
                  <div className="py-10">
                    <span className="mr-5">{"----- [Cuurent Tool] ----"}</span>
                    {currentTool}
                  </div>
                )}

                {/* render elements */}
                <div className="space-y-5">
                  {events && events.map((event, index) => (
                    <div className="" key={index}>
                      <span className="mr-5"> {">>"} </span>
                      {renderEventMessage(event)}
                    </div>
                  ))}
                
                </div>

                {runStarted && (
                  <div className="">
                    <span className="mr-5 animate-in">{"----- [AI StoryTeller Has Started] ----"}</span>
                    <br/>
                  </div>
                )}

              </div>
      </section>
    </div>
  )
}

export default StoryWritter