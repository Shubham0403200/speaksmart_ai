import type { Metadata } from "next";
import JobInterviewPage from "../_components/job-interview-page";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const metadata: Metadata = {
  title: "AI-Powered Job Interview Preparation | SpeakSmart AI",
  description:
    "Prepare for job interviews with SpeakSmart AI. Practice common interview questions, receive instant AI feedback, personalized tips, and downloadable performance reports.",
  keywords: [
    'job interview prep',
    'job interview prep using ai',
    'job interview prep ai',
    "job interview preparation",
    "interview preparation",
    "interview preparation ai",
    "interview preparation using ai",
    "AI interview practice",
    "mock interview",
    "interview questions",
    "interview tips",
    "interview feedback",
    "AI career coach",
    "job interview online practice",
    "interview performance report",
  ],
  openGraph: {
    title: "Job Interview Preparation | AI Practice & Feedback | SpeakSmart AI",
    description:
      "Experience AI-powered job interview preparation. Practice questions, get instant AI feedback, personalized tips, and downloadable performance reports to boost your confidence.",
    url: `${baseUrl}/job-interview`,
    siteName: "SpeakSmart AI",
    images: [
      {
        url: `${baseUrl}/images/job-interview-ai.jpg`,
        width: 1200,
        height: 630,
        alt: "AI-Powered Job Interview Practice",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Job Interview Preparation | SpeakSmart AI",
    description:
      "Boost your job interview skills with AI-powered practice, instant feedback, and personalized tips from SpeakSmart AI.",
    images: [`${baseUrl}/images/job-interview-ai.jpg`],
  },
  alternates: {
    canonical: `${baseUrl}/job-interview`,
  },
};

export default function JobInterviewSEOPage() {
  return <JobInterviewPage baseUrl={baseUrl} />;
}
