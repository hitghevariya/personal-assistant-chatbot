import { motion, AnimatePresence } from "framer-motion";
import { RefObject } from "react";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Sparkles } from "lucide-react";
import { Message } from "@/types/chat";
import { formatMessageTime } from "@/utils/chatUtils";
import {
  messageVariants,
  containerVariants,
  welcomeVariants,
  loadingVariants,
} from "@/constants/animations";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  scrollAreaRef: RefObject<HTMLDivElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

/**
 * Component that renders the message list with welcome screen and loading indicator
 * Handles message animations and scrolling behavior
 */
export default function MessageList({
  messages,
  isLoading,
  scrollAreaRef,
  messagesEndRef,
}: MessageListProps) {
  return (
    <CardContent className="flex-1 p-0 relative overflow-hidden">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <motion.div
          className="p-6 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome screen when no messages */}
          {messages.length === 0 && (
            <motion.div
              className="flex items-center justify-center h-[50vh] text-center"
              variants={welcomeVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-muted-foreground max-w-md">
                <motion.div
                  className="relative mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl" />
                  <Bot className="h-16 w-16 mx-auto relative text-primary" />
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Sparkles className="h-6 w-6 text-accent" />
                  </motion.div>
                </motion.div>

                <motion.h3
                  className="text-xl font-semibold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to AI Chat!
                </motion.h3>

                <motion.p
                  className="text-sm leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  I&apos;m here to help you with questions, provide information,
                  or just have a friendly conversation. What would you like to
                  talk about today?
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Message list */}
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && <LoadingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </motion.div>
      </ScrollArea>
    </CardContent>
  );
}

/**
 * Individual message bubble component
 */
function MessageBubble({
  message,
  index,
}: {
  message: Message;
  index: number;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      custom={index}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className={`flex gap-2 md:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar for assistant messages */}
      {!isUser && (
        <motion.div
          whileHover={{ scale: 1.12, rotate: 5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="drop-shadow-xl"
        >
          <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-4 ring-blue-300/30 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 text-white shadow-lg animate-pulse">
              <Bot className="h-5 w-5 md:h-6 md:w-6" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}

      {/* Message bubble */}
      <motion.div
        className={`max-w-[90%] md:max-w-[75%] px-4 md:px-6 py-3 md:py-4 relative rounded-3xl shadow-xl backdrop-blur-md border border-white/20 transition-all duration-200
          ${isUser
            ? "bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-400 text-white ml-8 md:ml-12 rounded-br-2xl"
            : "bg-gradient-to-br from-white/30 via-blue-100/60 to-blue-200/60 text-blue-900 rounded-bl-2xl dark:from-black/30 dark:via-blue-900/40 dark:to-blue-900/60 dark:text-white"
          }`}
        whileHover={{
          scale: 1.04,
          boxShadow: isUser
            ? "0 10px 32px -5px #60a5fa55"
            : "0 10px 32px -5px #818cf855",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.p
          className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {message.text}
        </motion.p>

        <motion.p
          className="text-xs opacity-70 mt-2 md:mt-3 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.2 }}
        >
          {formatMessageTime(message.createdAt)}
        </motion.p>

        {/* Message tail */}
        <div
          className={`absolute bottom-0 w-3 h-3 md:w-4 md:h-4
            ${isUser
              ? "right-0 bg-blue-500/80 dark:bg-blue-400/80 transform rotate-45 translate-x-1 md:translate-x-2 translate-y-1 md:translate-y-2"
              : "left-0 bg-white/40 dark:bg-blue-900/60 transform rotate-45 -translate-x-1 md:-translate-x-2 translate-y-1 md:translate-y-2"
            }`}
        />
      </motion.div>

      {/* Avatar for user messages */}
      {isUser && (
        <motion.div
          whileHover={{ scale: 1.12, rotate: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="drop-shadow-xl"
        >
          <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-4 ring-blue-400/30 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 text-white shadow-lg animate-pulse">
              <User className="h-5 w-5 md:h-6 md:w-6" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Loading indicator component
 */
function LoadingIndicator() {
  return (
    <motion.div
      variants={loadingVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex gap-4 justify-start items-end"
    >
      <motion.div whileHover={{ scale: 1.12 }}>
        <Avatar className="h-12 w-12 ring-4 ring-blue-300/30 shadow-lg">
          <AvatarFallback className="bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 text-white shadow-lg animate-pulse">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Bot className="h-6 w-6" />
            </motion.div>
          </AvatarFallback>
        </Avatar>
      </motion.div>
      <div className="relative">
        <div className="bg-gradient-to-br from-white/30 via-blue-100/60 to-blue-200/60 dark:from-black/30 dark:via-blue-900/40 dark:to-blue-900/60 rounded-3xl rounded-bl-2xl px-6 py-4 shadow-xl border border-white/20 backdrop-blur-md flex items-center gap-2 min-w-[64px]">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 shadow-lg"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-white/40 dark:bg-blue-900/60 transform rotate-45 -translate-x-2 translate-y-2" />
        {/* Glowing effect */}
        <span className="absolute -inset-2 rounded-3xl blur-lg opacity-30 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 animate-pulse" />
      </div>
    </motion.div>
  );
}
