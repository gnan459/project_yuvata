import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Play, Eye, Brain, Zap } from "lucide-react";

const features = [
  { icon: Eye, title: "Analyze Content", desc: "Examine messages, emails & social media posts" },
  { icon: Brain, title: "Think Critically", desc: "Decide if the content is real or fake" },
  { icon: Zap, title: "Use Tools", desc: "Optionally verify with AI evaluator tools" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <div className="w-20 h-20 rounded-2xl gradient-hero mx-auto flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Yuvatha
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Digital Literacy Challenge
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card p-4 flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-semibold text-sm text-foreground">{f.title}</span>
              <span className="text-xs text-muted-foreground text-center">{f.desc}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/game")}
          className="gradient-hero text-primary-foreground font-display font-bold text-lg px-10 py-4 rounded-xl flex items-center gap-3 mx-auto"
          style={{ boxShadow: "var(--shadow-button)" }}
        >
          <Play className="w-5 h-5" />
          Start Challenge
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Index;
