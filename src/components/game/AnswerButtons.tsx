import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface AnswerButtonsProps {
  onAnswer: (answer: "real" | "fake") => void;
  disabled: boolean;
  selected?: "real" | "fake" | null;
}

const AnswerButtons = ({ onAnswer, disabled, selected }: AnswerButtonsProps) => {
  return (
    <div className="flex gap-4 mt-6">
      <motion.button
        whileHover={!disabled ? { scale: 1.04 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        onClick={() => onAnswer("real")}
        disabled={disabled}
        className={`flex-1 py-4 rounded-xl font-display font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 ${
          selected === "real"
            ? "gradient-success text-success-foreground shadow-lg"
            : "bg-success/10 text-success hover:bg-success/20"
        } ${disabled && !selected ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Check className="w-5 h-5" />
        REAL
      </motion.button>

      <motion.button
        whileHover={!disabled ? { scale: 1.04 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        onClick={() => onAnswer("fake")}
        disabled={disabled}
        className={`flex-1 py-4 rounded-xl font-display font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 ${
          selected === "fake"
            ? "gradient-danger text-destructive-foreground shadow-lg"
            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
        } ${disabled && !selected ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <X className="w-5 h-5" />
        FAKE
      </motion.button>
    </div>
  );
};

export default AnswerButtons;
