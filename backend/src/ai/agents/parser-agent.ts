import {getGroqResponse, systemMessage, userMessage} from "../../groq/groq-api";
import {PARSER_DEFINITION_PROMPT} from "./parser-definition-prompt";
import {extractJsonFromString} from "../../utils/object-utils";

export const ParserAgent = {
    name: "parserAgent",
    description: "Parses user prompt and delegates to the appropriate agents.",
    getResponse: async (body: any): Promise<{ response: string, agentTasks: string[] }> => {
        const prompt = body.prompt;
        const context = body.context;
        const history = body.history || [];
        const fullHistory = [
            systemMessage(PARSER_DEFINITION_PROMPT),
            ...history.slice(-5),
            // userMessage(JSON.stringify(prompt))
        ]
        const answer = await getGroqResponse('only do this: ' + prompt, fullHistory);
        let response : { response: string, agentTasks: string[] };
        if (answer?.response) {
            try {
                response = extractJsonFromString(answer.response.replace('\n', '').trim()) as { response: string, agentTasks: string[] }
                if (!response.response){
                    response = {response: answer.response, agentTasks:[]}
                }
            } catch (e) {
                console.error(e);
                response = { response: answer.response, agentTasks: [] }
                return response;
            }
        } else {
            response = { response: "No response found in LLM answer", agentTasks: [] }
        }
        return response;
    }
}