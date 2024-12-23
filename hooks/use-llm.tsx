import { ChatOpenAI } from "@langchain/openai";
import { v4 as uuid } from "uuid";
import { type PromptProps, useChatSession } from "./use-chat-session";

export const useLLM = () => {
	const { getSessionById, addMessageToSession } = useChatSession();

	const runModel = async (props: PromptProps, sessionId: string) => {
		const currentSession = await getSessionById(sessionId);

		/**
		 * This is a defensive programming technique that ensures the function does not
		 * attempt to process an undefined or missing query. This is important because
		 * the function is being called with user-provided input, and we don't want to
		 * crash the app if the user provides an invalid or missing input.
		 */
		if (!props?.query) {
			return;
		}

		const apiKey = "";
		const model = new ChatOpenAI({
			modelName: "gpt-3.5-turbo",
			openAIApiKey: apiKey,
		});
		const newMessageId = uuid();
	};
};
