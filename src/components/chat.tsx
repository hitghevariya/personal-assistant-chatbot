"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useChatState } from "@/hooks/useChatState";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import { cardVariants } from "@/constants/animations";

export default function Chat() {
  const {
    // State
    messages,
    input,
    isLoading,
    buttonRotation,

    // Refs
    scrollAreaRef,
    messagesEndRef,
    textareaRef,

    // Actions
    setInput,
    sendMessage,
    clearConversation,
  } = useChatState();

  // Handle Enter key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient and glass effect */}
      <div className="absolute inset-0 z-0 animate-gradient-x bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-blue-400 opacity-60 blur-2xl" />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/80 via-background/60 to-background/90 backdrop-blur-2xl" />
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl h-[90vh] md:h-[85vh] flex items-center justify-center px-2 md:px-0"
      >
        <Card className="h-full flex flex-col shadow-2xl border border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-2xl rounded-3xl ring-1 ring-white/30 w-full max-w-full md:max-w-4xl overflow-hidden">
          {/* Header with title and clear button */}
          <ChatHeader
            messageCount={messages.length}
            onClearChat={clearConversation}
          />

          {/* Messages area with welcome screen and loading */}
          <MessageList
            messages={messages}
            isLoading={isLoading}
            scrollAreaRef={scrollAreaRef}
            messagesEndRef={messagesEndRef}
          />

          {/* Input area with textarea and send button */}
          <ChatInput
            input={input}
            isLoading={isLoading}
            buttonRotation={buttonRotation}
            textareaRef={textareaRef}
            onInputChange={setInput}
            onSendMessage={sendMessage}
            onKeyPress={handleKeyPress}
          />
        </Card>
      </motion.div>
    </div>
  );
}
