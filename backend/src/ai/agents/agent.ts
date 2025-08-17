import {getGroqResponse, systemMessage, userMessage} from "../../groq/groq-api";
import {extractJsonFromString} from "../../utils/object-utils";

type CreateAgentParams = {
    name: string,
    description: string,
    definitionPrompt: string,
    contextKey?: string
}
export const createAgent = ({name, description,definitionPrompt,contextKey} :CreateAgentParams) => {
    return (
        {
            name,
            description,
            getResponse: async ({prompt, context}: {prompt: string, context: any}): Promise<any> => {

                const fullHistory = [
                    systemMessage(definitionPrompt),
                ];

                if (contextKey && context[contextKey]) {
                    fullHistory.push(userMessage("Current state is:\n" + JSON.stringify(context[contextKey])));
                }
                
                if (context.history) {
                    fullHistory.push(...context.history);
                }

                const answer = await getGroqResponse(prompt, fullHistory);
                let response = {}
                if (answer?.response) {
                    try {
                        response = extractJsonFromString(answer.response.replace('\n', '').trim());
                    } catch (e) {
                        console.error(e);
                        response = answer.response
                    }
                }
                return response;
            }
        }
    )
}