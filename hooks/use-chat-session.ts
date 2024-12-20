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
	fix_grammer = "fix grammar",
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
	message: TChatMessage;
	title?: string;
	id: string;
	createdAt?: string;
	updatedAt?: string;
};

export const useChatSession = () => {
	const getSessions = async () => {
		return (await get("sessions")) || [];
	};

	const setSession = async (chatSession: TChatSession) => {
		const sessions = await getSessions();
		const newSessions = [chatSession, ...sessions];
		await set("chat-sessions", newSessions);
	};

	const getSessionById = async (id: string) => {
		const sessions = await getSessions();
		return sessions.find((sessions: TChatSession) => sessions.id === id);
	};

	const removeSessionById = async (id: string) => {
		const sessions = await getSessions();
		const newSessions = sessions.filter(
			(session: TChatSession) => session.id !== id,
		);
		await set("chat-sessions", newSessions);
	};

	return { getSessions, setSession, getSessionById, removeSessionById };
};
