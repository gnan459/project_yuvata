import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import fakePostImage from "@/assets/fake-instagram-post.jpg";

interface InstagramPostCardProps {
  username: string;
  caption: string;
  imageUrl?: string;
}

const InstagramPostCard = ({ username, caption, imageUrl }: InstagramPostCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-3">
        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
          Instagram Post
        </span>
      </div>

      <div className="border border-border rounded-xl mx-3 mb-3 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-3">
          <div className="w-9 h-9 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
            {username[0].toUpperCase()}
          </div>
          <span className="font-semibold text-sm text-foreground">{username}</span>
        </div>

        {/* Image */}
        <div className="w-full aspect-square bg-muted">
          <img
            src={imageUrl || fakePostImage}
            alt="Instagram post"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Heart className="w-5 h-5 text-foreground cursor-pointer hover:text-destructive transition-colors" />
              <MessageCircle className="w-5 h-5 text-foreground cursor-pointer hover:text-secondary transition-colors" />
              <Send className="w-5 h-5 text-foreground cursor-pointer hover:text-secondary transition-colors" />
            </div>
            <Bookmark className="w-5 h-5 text-foreground cursor-pointer hover:text-secondary transition-colors" />
          </div>
          <p className="text-sm text-foreground">
            <span className="font-semibold">{username}</span>{" "}
            <span className="text-foreground/80">{caption}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InstagramPostCard;
