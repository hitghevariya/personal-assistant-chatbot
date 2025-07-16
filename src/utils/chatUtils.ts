import { Message, GeminiMessage } from "@/types/chat";

// Local storage key for storing chat messages
const CHAT_STORAGE_KEY = "chatMessages";

export const loadMessagesFromStorage = (): Message[] => {
  try {
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!savedMessages) return [];

    return JSON.parse(savedMessages);
  } catch (error) {
    console.error("Failed to parse saved messages:", error);
    return [];
  }
};

export const saveMessagesToStorage = (messages: Message[]) => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save messages:", error);
  }
};

export const clearMessagesFromStorage = () => {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear messages:", error);
  }
};

export const convertToGeminiFormat = (messages: Message[]): GeminiMessage[] => {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.text,
  }));
};

export const createMessage = (
  text: string,
  role: "user" | "assistant"
): Message => {
  return {
    id: `${role}-${Date.now()}`,
    text: text.trim(),
    role,
    createdAt: new Date().toISOString(),
  };
};

export const scrollToBottom = (messagesEndRef: React.RefObject<HTMLDivElement | null>) => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
};

export const formatMessageTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString();
};
