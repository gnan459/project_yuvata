import { QuestionContent } from "@/components/game/ContentCard";

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
      sender: "Rahul",
      time: "10:45 AM",
      message: "Breaking News! Free laptops for all students. Register immediately using this link: bit.ly/free-laptop-govt",
    },
    correctAnswer: "fake",
  },
  {
    id: 2,
    content: {
      type: "email",
      from: "scholarship-support@gmail.com",
      subject: "Urgent Scholarship Offer",
      date: "March 10, 2026",
      body: "Congratulations! You have been selected for an international scholarship. Submit your bank details to receive funds immediately.",
    },
    correctAnswer: "fake",
  },
  {
    id: 3,
    content: {
      type: "instagram",
      username: "health_guru_official",
      caption: "Doctors reveal a fruit that cures diabetes instantly! Big pharma doesn't want you to know this! 🍎🔥 #health #cure",
    },
    correctAnswer: "fake",
  },
  {
    id: 4,
    content: {
      type: "message",
      sender: "Mom",
      time: "6:30 PM",
      message: "Don't forget to pick up milk on the way home. Dad is making pasta tonight.",
    },
    correctAnswer: "real",
  },
  {
    id: 5,
    content: {
      type: "email",
      from: "no-reply@university.edu",
      subject: "Library Hours Update",
      date: "March 8, 2026",
      body: "Dear students, please note that the library will have extended hours during exam week, from 7 AM to midnight. Best regards, Library Services.",
    },
    correctAnswer: "real",
  },
  {
    id: 6,
    content: {
      type: "instagram",
      username: "nasa",
      caption: "The James Webb Space Telescope captures stunning new images of the Crab Nebula. 🌌 #JWST #Space",
    },
    correctAnswer: "real",
  },
  {
    id: 7,
    content: {
      type: "message",
      sender: "Unknown",
      time: "2:15 AM",
      message: "ALERT: Your bank account has been compromised. Click here to verify your identity immediately or your account will be locked.",
    },
    correctAnswer: "fake",
  },
  {
    id: 8,
    content: {
      type: "email",
      from: "prince.nigeria@hotmail.com",
      subject: "You Have Inherited $4.5 Million",
      date: "March 5, 2026",
      body: "Dear beloved, I am a prince from Nigeria. My late father left $4.5 million which I need to transfer to your account. Please send your details.",
    },
    correctAnswer: "fake",
  },
  {
    id: 9,
    content: {
      type: "instagram",
      username: "fitness_coach_real",
      caption: "Consistency beats perfection every time. Here's my 3-month transformation following a balanced diet and regular exercise. 💪 #fitness",
    },
    correctAnswer: "real",
  },
  {
    id: 10,
    content: {
      type: "message",
      sender: "Priya",
      time: "4:00 PM",
      message: "Hey! The group study session is at 5 PM in the library. Don't forget to bring your notes.",
    },
    correctAnswer: "real",
  },
];
