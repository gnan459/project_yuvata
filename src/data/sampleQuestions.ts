import { QuestionContent } from "@/components/game/ContentCard";
import image1 from "@/assets/1.png";
import image2 from "@/assets/2.png";
import image3 from "@/assets/3.png";

export interface Question {
  id: number;
  content: QuestionContent;
  correctAnswer: "real" | "fake";
}

export const sampleQuestions: Question[] = [
  {
    id: 1,
    content: {
      type: "message",
      sender: "Unknown",
      time: "9:10 AM",
      message:
        "Government Digital Literacy Program: All students will receive ₹10,000 education support. Register now using this short link: bit.ly/govt-support-fund",
    },
    correctAnswer: "fake",
  },
  {
    id: 2,
    content: {
      type: "email",
      from: "support@paytm-security.co",
      subject: "Account Verification Required",
      date: "March 12, 2026",
      body:
        "Dear user, unusual activity has been detected on your wallet. Please click the link below and enter your OTP and PIN to secure your account immediately.",
    },
    correctAnswer: "fake",
  },

  /* INSTAGRAM QUESTIONS (UNCHANGED) */

  {
    id: 3,
    content: {
      type: "instagram",
      username: "health_guru_official",
      caption:
        "Doctors hate this secret fruit! 🍎\n\nIt can cure diabetes naturally in just 3 days.\n\nBig pharmaceutical companies don't want you to know this simple trick.\n\n#health #miracle #naturalcure #diabetes",
      imageUrl: image1,
    },
    correctAnswer: "fake",
  },

  {
    id: 4,
    content: {
      type: "message",
      sender: "College Admin",
      time: "11:00 AM",
      message:
        "Reminder: The university cybersecurity awareness workshop will be held tomorrow at 3 PM in Auditorium B.",
    },
    correctAnswer: "real",
  },

  {
    id: 5,
    content: {
      type: "email",
      from: "it-support@university.edu",
      subject: "Password Security Reminder",
      date: "March 8, 2026",
      body:
        "Dear students, please remember never to share your university login credentials with anyone. The IT department will never ask for your password by email.",
    },
    correctAnswer: "real",
  },

  {
    id: 6,
    content: {
      type: "instagram",
      username: "conspiracy_truth_channel",
      caption:
        "🚨 BREAKING: Scientists secretly confirmed aliens landed on Earth last year.\n\nGovernments around the world are hiding the truth from the public.\n\nShare this before they remove it! 👽\n\n#aliens #conspiracy #truth #ufo",
      imageUrl: image2,
    },
    correctAnswer: "fake",
  },

  {
    id: 7,
    content: {
      type: "message",
      sender: "Unknown",
      time: "1:45 PM",
      message:
        "Urgent notice: Your SIM card will be blocked today. Send your Aadhaar number and OTP immediately to reactivate your number.",
    },
    correctAnswer: "fake",
  },

  {
    id: 8,
    content: {
      type: "email",
      from: "lottery@international-prize.com",
      subject: "You Won the Global Internet Lottery",
      date: "March 5, 2026",
      body:
        "Congratulations! Your email has been randomly selected to win $2 million in the global internet lottery. Please send your passport details to claim the reward.",
    },
    correctAnswer: "fake",
  },

  {
    id: 9,
    content: {
      type: "instagram",
      username: "apple_giveaway_official",
      caption:
        "🎉 Apple is giving away 1000 FREE iPhones to celebrate their anniversary!\n\nTo participate:\n1️⃣ Follow this account\n2️⃣ Like this post\n3️⃣ Click the link in bio\n\nHurry! Only the first 1000 people will get it! ⏳\n\n#giveaway #freeiphone #winiphone #apple",
      imageUrl: image3,
    },
    correctAnswer: "fake",
  },

  {
    id: 10,
    content: {
      type: "message",
      sender: "News Alert",
      time: "8:20 PM",
      message:
        "According to the World Health Organization, regular handwashing reduces the spread of infectious diseases. Learn more at who.int.",
    },
    correctAnswer: "real",
  },
];