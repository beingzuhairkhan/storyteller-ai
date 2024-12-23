import type { Frame } from "@gptscript-ai/gptscript";


import React from 'react';



const renderEventMessage = (event: Frame): React.ReactNode => {

   switch(event.type){
    case "runStart":
        return <div>Run Started at {event.start}</div>;

    case "callStart":
        return(
            <div className="">
                <p>Tool Starting : {event.tool?.description}</p>
            </div>
        );

    case "callChat":
        return(
            <div className="">
                Chat in progress with your input {">>"} {String(event.input)}
            </div>
        ) ;
        
     case "callProgress":
        return null ;   


     case "callFinish":
        return(
            <div className="">
                callfinished:{" "}
                {
                    event?.output?.map((output)=>(
                        <div className="" key={output.content}>{output.content}</div>
                    ))
                }
            </div>
        )   ;

        case "runFinish":
            return <div className=""> Run finished at {event.end}  </div>

        case "callSubCalls":
            return(
                <div className="">
                    sub-calls in progress:
                    {
                        event.output?.map((output , index)=>(
                            <div className="" key={index} >
                                <div className=""> {output.content} </div>
                                {
                                    output.subCalls && Object.keys(output.subCalls).map((subCallKey)=>(
                                        <div className="" key={subCallKey} >
                                            <strong>SUbCall {subCallKey}: </strong>
                                            <div className="">Tool ID : {output.subCalls[subCallKey].toolID}</div>
                                            <div className="">Input : {output.subCalls[subCallKey].input} </div>
                                        </div>
                                    ))
                                }
                            </div>
                        
                        ))
                    }
                </div>
            ) ;
            case "callContinue":
                return(
                    <div className="">
                        sub-calls in progress:
                        {
                            event.output?.map((output , index)=>(
                                <div className="" key={index} >
                                    <div className=""> {output.content} </div>
                                    {
                                        output.subCalls && Object.keys(output.subCalls).map((subCallKey)=>(
                                            <div className="" key={subCallKey} >
                                                <strong>SUbCall {subCallKey}: </strong>
                                                <div className="">Tool ID : {output.subCalls[subCallKey].toolID}</div>
                                                <div className="">Input : {output.subCalls[subCallKey].input} </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            
                            ))
                        }
                    </div>
                )  ;
                
                case "callConfirm":
                    return(
                        <div className="">
                            sub-calls in progress:
                            {
                                event.output?.map((output , index)=>(
                                    <div className="" key={index} >
                                        <div className=""> {output.content} </div>
                                        {
                                            output.subCalls && Object.keys(output.subCalls).map((subCallKey)=>(
                                                <div className="" key={subCallKey} >
                                                    <strong>SUbCall {subCallKey}: </strong>
                                                    <div className="">Tool ID : {output.subCalls[subCallKey].toolID}</div>
                                                    <div className="">Input : {output.subCalls[subCallKey].input} </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                
                                ))
                            }
                        </div>
                    )    ;
                    default:
                        return <pre> {JSON.stringify(event , null , 2)} </pre>
           }
       }   




export default renderEventMessage;