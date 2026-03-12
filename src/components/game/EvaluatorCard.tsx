import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface InstagramPost {
  caption: string;
  username: string;
}

interface EvaluatorCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  placeholderText: string;
  onToolUsed: () => void;
  postData?: InstagramPost;
}

interface AnalysisResult {
  overall_risk_level: string;
  prediction: string;
  source_credibility: string;
  explanation: string;
}

const EvaluatorCard = ({ 
  title, 
  description, 
  buttonLabel, 
  placeholderText, 
  onToolUsed,
  postData 
}: EvaluatorCardProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!postData) return;

    setLoading(true);
    setError(null);
    onToolUsed();

    try {
      const response = await fetch("http://localhost:8000/api/evaluate-instagram-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption: postData.caption,
          username: postData.username,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze post");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-orange-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getPredictionIcon = (prediction: string) => {
    return prediction.toLowerCase() === "fake" ? "🚫" : "✓";
  };

  const getCredibilityColor = (credibility: string) => {
    switch (credibility.toLowerCase()) {
      case "high":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg gradient-tool flex items-center justify-center">
          <Search className="w-4 h-4 text-secondary-foreground" />
        </div>
        <h3 className="font-display font-semibold text-sm text-foreground">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{description}</p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalyze}
        disabled={loading || !postData}
        className="w-full py-2.5 rounded-lg gradient-tool text-secondary-foreground font-display font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          buttonLabel
        )}
      </motion.button>

      <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border min-h-[100px]">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
          Analysis Results
        </p>
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-500">{error}</p>
            </motion.div>
          ) : result ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Risk Level</span>
                <span className={`text-xs font-mono font-semibold ${getRiskColor(result.overall_risk_level)}`}>
                  {result.overall_risk_level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Prediction</span>
                <span className="text-xs font-mono">
                  {getPredictionIcon(result.prediction)} {result.prediction.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Source Credibility</span>
                <span className={`text-xs font-mono font-semibold ${getCredibilityColor(result.source_credibility)}`}>
                  {result.source_credibility}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed border-t border-border pt-2">
                💡 {result.explanation}
              </p>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground italic"
            >
              {placeholderText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EvaluatorCard;
