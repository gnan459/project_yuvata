import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Question {current} / {total}
        </span>
        <span className="text-xs font-semibold text-primary">{percent}% completed</span>
      </div>
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full gradient-hero"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
