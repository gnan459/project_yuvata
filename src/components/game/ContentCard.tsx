import MessageBubble from "./MessageBubble";
import EmailCard from "./EmailCard";
import InstagramPostCard from "./InstagramPostCard";

export type ContentType = "message" | "email" | "instagram";

export interface QuestionContent {
  type: ContentType;
  // Message fields
  sender?: string;
  time?: string;
  message?: string;
  // Email fields
  from?: string;
  subject?: string;
  date?: string;
  body?: string;
  // Instagram fields
  username?: string;
  caption?: string;
  imageUrl?: string;
}

interface ContentCardProps {
  content: QuestionContent;
}

const ContentCard = ({ content }: ContentCardProps) => {
  switch (content.type) {
    case "message":
      return (
        <MessageBubble
          sender={content.sender || ""}
          time={content.time || ""}
          message={content.message || ""}
        />
      );
    case "email":
      return (
        <EmailCard
          from={content.from || ""}
          subject={content.subject || ""}
          date={content.date || ""}
          body={content.body || ""}
        />
      );
    case "instagram":
      return (
        <InstagramPostCard
          username={content.username || ""}
          caption={content.caption || ""}
          imageUrl={content.imageUrl}
        />
      );
  }
};

export default ContentCard;
