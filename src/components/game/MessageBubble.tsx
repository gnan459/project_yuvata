import { motion } from "framer-motion";

interface MessageBubbleProps {
  sender: string;
  time: string;
  message: string;
}

const MessageBubble = ({ sender, time, message }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-block px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold uppercase tracking-wider">
          Message
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-muted p-4 max-w-[85%]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-semibold text-foreground">{sender}</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <div className="relative">
          <div className="absolute -left-2 top-0 w-3 h-3 bg-muted transform rotate-45 -translate-x-1" />
          <p className="text-foreground/90 text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
