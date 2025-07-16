import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { MessageSquare, RotateCcw } from "lucide-react";
import { headerVariants, buttonVariants } from "@/constants/animations";

interface ChatHeaderProps {
  messageCount: number;
  onClearChat: () => void;
}

/**
 * Header component for the chat interface
 * Shows title, message counter, and clear chat functionality
 */
export default function ChatHeader({ messageCount, onClearChat }: ChatHeaderProps) {
  return (
    <CardHeader className="border-b bg-gradient-to-r from-card via-card/90 to-card rounded-t-lg">
      <motion.div
        className="flex items-center justify-between"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="h-6 w-6 text-primary" />
          </motion.div>
          
          <div>
            <motion.h1
              className="text-2xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              AI Chat Assistant
            </motion.h1>
            
            <motion.p
              className="text-sm text-muted-foreground"
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
      </motion.div>
    </CardHeader>
  );
} 