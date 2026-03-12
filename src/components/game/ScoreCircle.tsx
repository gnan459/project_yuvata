import { motion } from "framer-motion";

interface ScoreCircleProps {
  score: number;
  total: number;
}

const ScoreCircle = ({ score, total }: ScoreCircleProps) => {
  const percent = Math.round((score / total) * 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const getLevel = () => {
    if (percent >= 80) return { label: "Advanced", color: "text-success" };
    if (percent >= 50) return { label: "Moderate", color: "text-secondary" };
    return { label: "Beginner", color: "text-primary" };
  };

  const level = getLevel();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/ {total}</span>
        </div>
      </div>
      <span className={`font-display font-bold text-lg ${level.color}`}>{level.label}</span>
    </div>
  );
};

export default ScoreCircle;
