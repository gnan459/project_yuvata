import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, AlertTriangle } from "lucide-react";
import ContentCard from "@/components/game/ContentCard";
import AnswerButtons from "@/components/game/AnswerButtons";
import ProgressBar from "@/components/game/ProgressBar";
import EvaluatorCard from "@/components/game/EvaluatorCard";
import { sampleQuestions } from "@/data/sampleQuestions";

const GamePage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<"real" | "fake" | null>(null);
  const [answers, setAnswers] = useState<("real" | "fake")[]>([]);
  const [toolUsed, setToolUsed] = useState(false);
  const [toolUsageCount, setToolUsageCount] = useState(0);
  const [toolUsedPerQuestion, setToolUsedPerQuestion] = useState(false);

  const question = sampleQuestions[currentIndex];
  const total = sampleQuestions.length;

  const handleAnswer = (answer: "real" | "fake") => {
    setSelected(answer);
  };

  const handleNext = () => {
    if (selected) {
      const newAnswers = [...answers, selected];
      setAnswers(newAnswers);

      if (currentIndex + 1 >= total) {
        const correct = newAnswers.filter(
          (a, i) => a === sampleQuestions[i].correctAnswer
        ).length;
        navigate("/results", {
          state: {
            score: correct,
            total,
            toolUsageCount,
            attempted: newAnswers.length,
          },
        });
      } else {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
        setToolUsedPerQuestion(false);
      }
    }
  };

  const handleToolUsed = () => {
    if (!toolUsedPerQuestion) {
      setToolUsageCount((c) => c + 1);
      setToolUsedPerQuestion(true);
    }
    setToolUsed(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-navy px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg md:text-xl font-bold text-primary-foreground">
              Yuvatha Digital Literacy Challenge
            </h1>
            <p className="text-primary-foreground/60 text-xs hidden md:block">
              Identify real vs fake content
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Progress */}
        <ProgressBar current={currentIndex + 1} total={total} />

        {/* Main layout */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Left Panel */}
          <div className="lg:w-[70%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Tool used indicator */}
                {toolUsedPerQuestion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs font-medium text-secondary">
                      Verification Tool Used
                    </span>
                  </motion.div>
                )}

                <ContentCard content={question.content} />

                <AnswerButtons
                  onAnswer={handleAnswer}
                  disabled={selected !== null}
                  selected={selected}
                />

                {selected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="w-full py-3 rounded-xl gradient-hero text-primary-foreground font-display font-bold text-base flex items-center justify-center gap-2"
                      style={{ boxShadow: "var(--shadow-button)" }}
                    >
                      {currentIndex + 1 >= total ? "View Results" : "Next Question"}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Panel */}
          <div className="lg:w-[30%] space-y-4">
            {question.content.type === "instagram" && (
              <EvaluatorCard
                title="Instagram Post Evaluator"
                description="Used to analyze Instagram posts containing images and captions."
                buttonLabel="Analyze Instagram Post"
                placeholderText="Image verification results will appear here."
                onToolUsed={handleToolUsed}
                postData={{
                  caption: question.content.caption,
                  username: question.content.username,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
