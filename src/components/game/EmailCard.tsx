import { motion } from "framer-motion";
import { Mail } from "lucide-react";

interface EmailCardProps {
  from: string;
  subject: string;
  date: string;
  body: string;
}

const EmailCard = ({ from, subject, date, body }: EmailCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wider">
          Email
        </span>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="bg-muted/50 px-4 py-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">From:</span>
            <span className="text-sm font-medium text-foreground">{from}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground ml-6">Subject:</span>
            <span className="text-sm font-semibold text-foreground">{subject}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground ml-6">Date:</span>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-foreground/90 leading-relaxed">{body}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailCard;
