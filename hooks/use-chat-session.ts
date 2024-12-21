import type { AIMessage, HumanMessage } from "@langchain/core/messages";
import { get, set } from "idb-keyval";

export enum ModelType {
	GPT3 = "gpt-3",
	GPT4 = "gpt-4",
	CLAUDE2 = "claude-2",
	CLAUDE3 = "claude-3",
	GPT3_5 = "gpt-3.5-turbo",
}

export enum PromptType {
	ask = "ask",
	answer = "answer",
	explain = "explain",
	summarize = "summarize",
	translate = "translate",
	improve = "improve",
	fix_grammar = "fix grammar",
	reply = "reply",
	short_reply = "short reply",
}

export enum RoleType {
	assistant = "assistant",
	writing_expert = "writing_expert",
	social_media_expert = "social_media_expert",
}

export type PromptProps = {
	type: PromptType;
	role: RoleType;
	context?: string;
	query?: string;
	regenerate?: boolean;
};

export type TChatMessage = {
	id: string;
	model: ModelType;
	human: HumanMessage;
	ai: AIMessage;
	rawHuman: string;
	rawAI: string;
	props?: PromptProps;
	createdAt?: string;
	updatedAt?: string;
};

export type TChatSession = {
	messages: TChatMessage[];
	title?: string;
	id: string;
	createdAt?: string;
	updatedAt?: string;
};

export const useChatSession = () => {
	// getSessions is a function that returns an array of chat sessions
	const getSessions = async () => {
		return (await get("sessions")) || [];
	};

	// setSession is a function that takes a chat session and adds it to the list of chat sessions
	const setSession = async (chatSession: TChatSession) => {
		const sessions = await getSessions(); // get the list of chat sessions
		const newSessions = [chatSession, ...sessions]; // add the new chat session to the list
		await set("chat-sessions", newSessions); // set the list of chat sessions
	};

	// getSessionById is a function that takes an id and returns the chat session with that id
	const getSessionById = async (id: string) => {
		const sessions = await getSessions(); // get the list of chat sessions
		return sessions.find((sessions: TChatSession) => sessions.id === id); // return the chat session with that id
	};

	// removeSessionById is a function that takes an id and removes the chat session with that id from the list of chat sessions
	const removeSessionById = async (id: string) => {
		const sessions = await getSessions(); // get the list of chat sessions
		const newSessions = sessions.filter(
			(session: TChatSession) => session.id !== id,
		);
		await set("chat-sessions", newSessions);
	};

	const addMessageToSession = async (
		sessionId: string,
		chatMessage: TChatMessage,
	) => {
		const sessions = await getSessions(); // get the list of chat sessions
		const newSessions = sessions.map((session: TChatSession) => {
			if (session.id === sessionId) {
				return {
					...session,
					messages: [...session.messages, chatMessage],
				};
			}
			return session;
		});
		await set("chat-sessions", newSessions);
	};

	const updateSession = async (
		sessionId: string,
		newSession: Omit<TChatSession, "id">,
	) => {
		const sessions = await getSessions();
		const newSessions = sessions.map((session: TChatSession) => {
			if (session.id === sessionId) {
				return {
					...session,
					...newSession,
				};
			}
			return session;
		});
		await set("chat-sessions", newSessions);
	};

	return {
		getSessions,
		setSession,
		getSessionById,
		removeSessionById,
		addMessageToSession,
		updateSession,
	};
};
