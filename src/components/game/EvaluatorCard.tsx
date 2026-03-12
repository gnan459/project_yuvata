import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface PostData {
  caption: string;
  username?: string;
}

interface AnalysisResult {
  username?: string;
  caption: string;
  overall_risk_level: string;
  source_credibility: string;
  prediction: "real" | "fake";
  explanation: string;
}

interface EvaluatorCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  placeholderText: string;
  onToolUsed: () => void;
  postData?: PostData;
  apiEndpoint?: string;
}

const EvaluatorCard = ({ title, description, buttonLabel, placeholderText, onToolUsed, postData, apiEndpoint = "http://localhost:8000" }: EvaluatorCardProps) => {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    onToolUsed();

    try {
      if (postData && apiEndpoint) {
        // Make API call to FastAPI backend
        const response = await fetch(`${apiEndpoint}/api/evaluate-instagram-post`, {
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
          throw new Error(`API error: ${response.statusText}`);
        }

        const result = await response.json();
        setAnalysisResult(result);
      } else {
        // Fallback to mock data if no API endpoint
        setTimeout(() => {
          setLoading(false);
          setAnalyzed(true);
        }, 1500);
        return;
      }

      setLoading(false);
      setAnalyzed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze post");
      setLoading(false);
      setAnalyzed(true);
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
        disabled={loading}
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

      <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border min-h-[80px]">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
          API Response Area
        </p>
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-500">{error}</span>
              </div>
              <p className="text-xs text-muted-foreground italic mt-2">
                Make sure the FastAPI server is running on {apiEndpoint}
              </p>
            </motion.div>
          ) : analyzed && analysisResult ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Overall Risk Level</span>
                <span className={`text-xs font-mono font-semibold ${
                  analysisResult.overall_risk_level === "Low" ? "text-green-500" :
                  analysisResult.overall_risk_level === "Medium" ? "text-yellow-500" :
                  analysisResult.overall_risk_level === "High" ? "text-orange-500" :
                  "text-red-500"
                }`}>
                  {analysisResult.overall_risk_level}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Prediction</span>
                <div className="flex items-center gap-1">
                  {analysisResult.prediction === "fake" ? (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  ) : (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  )}
                  <span className={`text-xs font-mono font-semibold ${
                    analysisResult.prediction === "fake" ? "text-red-500" : "text-green-500"
                  }`}>
                    {analysisResult.prediction.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Source Credibility</span>
                <span className={`text-xs font-mono font-semibold ${
                  analysisResult.source_credibility === "High" ? "text-green-500" :
                  analysisResult.source_credibility === "Medium" ? "text-yellow-500" :
                  "text-red-500"
                }`}>
                  {analysisResult.source_credibility}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                  Analysis
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {analysisResult.explanation}
                </p>
              </div>
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
