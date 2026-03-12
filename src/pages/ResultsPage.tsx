import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Target, CheckCircle, Wrench, ArrowLeft, Lightbulb } from "lucide-react";
import ScoreCircle from "@/components/game/ScoreCircle";

interface ResultState {
  score: number;
  total: number;
  toolUsageCount: number;
  attempted: number;
}

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as ResultState) || {
    score: 7,
    total: 10,
    toolUsageCount: 3,
    attempted: 10,
  };

  const percent = Math.round((state.score / state.total) * 100);

  const tips = percent >= 80
    ? [
        "Great job! Keep staying vigilant against misinformation.",
        "Share your digital literacy skills with friends and family.",
      ]
    : percent >= 50
    ? [
        "Always verify the source before sharing information online.",
        "Check URLs carefully — look for misspellings or unusual domains.",
        "Be cautious of messages that create urgency or demand personal information.",
      ]
    : [
        "You should verify sources before sharing information online.",
        "Never share personal or financial details through links in messages.",
        "If something sounds too good to be true, it probably is.",
        "Use fact-checking websites to verify news before believing it.",
      ];

  const stats = [
    { icon: Target, label: "Questions Attempted", value: state.attempted },
    { icon: CheckCircle, label: "Correct Answers", value: state.score },
    { icon: Wrench, label: "Tool Usage Count", value: state.toolUsageCount },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-navy px-4 py-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-lg md:text-xl font-bold text-primary-foreground">
            Your Digital Literacy Results
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 flex flex-col items-center"
        >
          <h2 className="font-display text-xl font-bold text-foreground mb-6">
            Digital Literacy Score
          </h2>
          <ScoreCircle score={Math.round(percent)} total={100} />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card p-5 flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground text-center">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              Improvement Tips
            </h3>
          </div>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="w-full py-3 rounded-xl gradient-hero text-primary-foreground font-display font-bold flex items-center justify-center gap-2"
          style={{ boxShadow: "var(--shadow-button)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Play Again
        </motion.button>
      </div>
    </div>
  );
};

export default ResultsPage;
