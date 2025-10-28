import type { Metadata } from "next";
import SpeakingPage from "../_components/speaking-page";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const metadata: Metadata = {
  title: "AI-Powered Speaking & Communication Improvement | SpeakSmart AI",
  description:
    "Enhance your English speaking and communication skills with SpeakSmart AI. Practice real-life conversations, receive instant AI feedback, and improve fluency, pronunciation, and confidence.",
  keywords: [
    "AI speaking practice",
    "AI communication improvement",
    "English speaking AI coach",
    "AI pronunciation trainer",
    "fluency improvement AI",
    "spoken English practice",
    "AI conversation partner",
    "AI speaking feedback",
    "English communication training",
    "communication skill improvement",
    "public speaking AI coach",
    "AI speech practice",
    "speaking confidence AI",
    "English fluency improvement",
    "AI English speaking app",
  ],
  openGraph: {
    title:
      "AI-Powered Speaking & Communication Improvement | SpeakSmart AI",
    description:
      "Practice English speaking and communication with real-time AI feedback. Improve pronunciation, fluency, and confidence with personalized tips and reports from SpeakSmart AI.",
    url: `${baseUrl}/speaking`,
    siteName: "SpeakSmart AI",
    images: [
      {
        url: `${baseUrl}/images/ai-speaking-communication.jpg`,
        width: 1200,
        height: 630,
        alt: "AI Speaking & Communication Practice",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Speaking & Communication Practice | SpeakSmart AI",
    description:
      "Boost your English communication skills with AI-powered speaking practice, instant feedback, and personalized improvement tips.",
    images: [`${baseUrl}/images/ai-speaking-communication.jpg`],
  },
  alternates: {
    canonical: `${baseUrl}/speaking`,
  },
};

export default function SpeakingSEOPage() {
  return <SpeakingPage baseUrl={baseUrl} />;
}
