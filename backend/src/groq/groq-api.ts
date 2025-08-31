import {Groq} from 'groq-sdk';
import dotenv from 'dotenv'
import {log} from "console";
import * as https from "node:https";
import {ChatMessage} from "../ai/types";


dotenv.config();
const httpsAgent = new https.Agent({rejectUnauthorized: false});
const groq = new Groq({apiKey: process.env.GROQ_API_KEY, httpAgent: httpsAgent});


export async function getGroqResponse(prompt: string, messageHistory: ChatMessage[], options:{jsonResponse?:boolean, includeHistory?:boolean}={jsonResponse:true,includeHistory:true}) {
    // log({messageHistory, prompt});
    const newHistory: ChatMessage[] = messageHistory.concat([userMessage(prompt)]);
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: newHistory,
            // model: "llama3-8b-8192",
            // model: "llama-3.3-70b-versatile",
            model: 'llama-3.1-8b-instant',
            response_format: {type: options?.jsonResponse ? 'json_object':'text'},
            temperature: 0,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null,
        });
        const res: any = {
            response: chatCompletion.choices[0].message.content,
        }
        if (options?.includeHistory){
            res.messageHistory = newHistory
        }
        return res
    } catch (error) {
        console.error(error);
    }
}

export async function getGroqResponseFromMessages(messages:ChatMessage[]){
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama3-8b-8192",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });
        return {
            response: chatCompletion.choices[0].message.content,
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getGroqResponseWithDefinitionPrompt(definitionPrompt: string, prompt: string, messageHistory: ChatMessage[]) {
    const definitionPromptMessage = systemMessage(definitionPrompt);
    const promptMessage = userMessage(prompt)
    const fullHistory = [definitionPromptMessage, promptMessage];
    return await getGroqResponse(prompt, [definitionPromptMessage]);
}

export function userMessage(content: string): ChatMessage {
    return {role: "user", content};
}

export function assistantMessage(content: string): ChatMessage {
    return {role: "assistant", content};
}

export function systemMessage(content: string): ChatMessage {
    return {role: "system", content};
}