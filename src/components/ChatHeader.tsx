import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { MessageSquare, RotateCcw, Sun, Moon } from "lucide-react";
import { headerVariants, buttonVariants } from "@/constants/animations";
import { useTheme } from "@/contexts/ThemeContext";

interface ChatHeaderProps {
  messageCount: number;
  onClearChat: () => void;
}

/**
 * Header component for the chat interface
 * Shows title, message counter, theme toggle, and clear chat functionality
 */
export default function ChatHeader({
  messageCount,
  onClearChat,
}: ChatHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <CardHeader className="border-b bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-t-3xl shadow-lg">
      <motion.div
        className="flex items-center justify-between"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-6">
          {/* Glowing animated avatar */}
          <motion.div
            className="relative p-3 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 shadow-xl"
            animate={{ scale: [1, 1.08, 1], boxShadow: [
              '0 0 32px 8px #a78bfa55',
              '0 0 48px 16px #f472b655',
              '0 0 32px 8px #a78bfa55',
            ] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <MessageSquare className="h-8 w-8 text-white drop-shadow-lg" />
            <span className="absolute -inset-1 rounded-full blur-xl opacity-40 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 animate-pulse" />
          </motion.div>
          <div>
            <motion.h1
              className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Personal Assistant
            </motion.h1>
            <motion.p
              className="text-base text-muted-foreground/80 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {messageCount > 0
                ? `${messageCount} messages in conversation`
                : "Ready to help you"}
            </motion.p>
          </div>
        </div>

        {/* Action buttons container */}
        <div className="flex items-center gap-2">
          {/* Theme toggle button */}
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="text-xs hover:bg-accent/50 transition-all duration-200"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-3 w-3 mr-1" />
              ) : (
                <Sun className="h-3 w-3 mr-1" />
              )}
              {theme === "light" ? "Dark" : "Light"}
            </Button>
          </motion.div>

          {/* Clear chat button */}
          {messageCount > 0 && (
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onClearChat}
                className="text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear Chat
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </CardHeader>
  );
} 