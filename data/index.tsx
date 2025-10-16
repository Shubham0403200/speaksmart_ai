import { Mic, FileText, Gauge, ArrowUpRight } from "lucide-react";

export const faqsData = [
  {
    question: "How does SpeakSmart AI help improve my English speaking?",
    answer: "SpeakSmart AI provides instant feedback on your spoken English, helping you practice IELTS speaking, job interviews, or daily conversations with AI-generated corrections and tips."
  },
  {
    question: "Do I need to sign up or log in to use SpeakSmart AI?",
    answer: "No, you can start practicing immediately without any login. Simply select a module and start speaking."
  },
  {
    question: "Can I practice IELTS speaking using SpeakSmart AI?",
    answer: "Yes, we provide IELTS-specific speaking prompts with instant evaluation and a band score estimate along with improvement tips."
  },
  {
    question: "Does SpeakSmart AI help with job interview preparation?",
    answer: "Absolutely! You can practice AI-powered mock interviews and get real-time feedback to improve your answers and confidence."
  },
  {
    question: "Can I download my speaking performance reports?",
    answer: "Yes, after completing a session, you can download detailed reports including transcripts, feedback, and score analysis."
  },
  {
    question: "Is SpeakSmart AI suitable for beginners?",
    answer: "Yes, our AI adapts to all levels, from beginner to advanced, providing guidance, corrections, and suggestions tailored to your fluency."
  }
];

export const features = [
    {
      title: "IELTS Speaking Practice",
      description: "Practice IELTS speaking with AI feedback and get band scores with tips.",
      href: "/ielts-speaking",
    },
    {
      title: "AI Job Interview Prep",
      description: "Prepare for job interviews with AI-powered mock questions and real-time feedback.",
      href: "/job-interview",
    },
    {
      title: "AI Communication & Fluency",
      description: "Improve your spoken English and communication skills for daily conversations or presentations.",
      href: "/speaking",
    },
  ];

export const steps = [
  {
    icon: <Mic className="w-6 h-6 md:w-10 md:h-10 text-indigo-600" />,
    title: "Record",
    description:
      "Answer the question using your microphone — no login required.",
  },
  {
    icon: <FileText className="w-6 h-6 md:w-10 md:h-10 text-indigo-600" />,
    title: "Transcribe",
    description:
      "We convert your speech to text instantly and display it for you.",
  },
  {
    icon: <Gauge className="w-6 h-6 md:w-10 md:h-10 text-indigo-600" />,
    title: "Evaluate",
    description:
      "Our AI analyzes your response and gives you a band score with tips.",
  },
  {
    icon: <ArrowUpRight className="w-6 h-6 md:w-10 md:h-10 text-indigo-600" />,
    title: "Improve",
    description:
      "Download a detailed report and retry to track your improvement.",
  },
];
