import { motion, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { RefObject } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  buttonRotation: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

/**
 * Input component for the chat interface
 * Features auto-resizing textarea and animated send button
 */
export default function ChatInput({
  input,
  isLoading,
  buttonRotation,
  textareaRef,
  onInputChange,
  onSendMessage,
  onKeyPress,
}: ChatInputProps) {
  // Animation values for input scaling
  const inputScale = useSpring(1);

  return (
    <CardFooter className="border-t bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-b-3xl shadow-lg p-6">
      <motion.div
        className="flex w-full gap-4 items-end"
        style={{ scale: inputScale }}
      >
        <div className="flex-1 relative">
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
            minRows={1}
            maxRows={6}
            className="w-full resize-none rounded-2xl border border-white/30 bg-white/30 dark:bg-black/30 px-5 py-4 text-base font-medium ring-offset-background placeholder:text-blue-900/50 dark:placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-xl backdrop-blur-md transition-all duration-200"
            onFocus={() => inputScale.set(1.04)}
            onBlur={() => inputScale.set(1)}
          />

          {/* Glowing animated send button */}
          <motion.div
            className="absolute bottom-3 right-3"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: buttonRotation }}
          >
            <Button
              onClick={onSendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="h-10 w-10 p-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-400 to-indigo-400 shadow-2xl hover:from-blue-400 hover:to-indigo-500 focus-visible:ring-2 focus-visible:ring-blue-400/60 transition-all duration-200 relative"
            >
              <span className="absolute inset-0 rounded-full blur-lg opacity-40 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 animate-pulse" />
              <Send className="h-5 w-5 mb-0.5 text-white drop-shadow-lg" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </CardFooter>
  );
}
