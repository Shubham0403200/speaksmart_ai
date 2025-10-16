import type { Metadata } from "next";
import IELTSSpeakingPage from "./_components/ielts-speaking-page";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const metadata: Metadata = {
  title: "IELTS Speaking Practice Test | AI Band Evaluation | SpeakSmart AI",
  description:
    "Take a real IELTS Speaking Test powered by SpeakSmart AI. Get instant band feedback, personalized speaking tips, and a downloadable performance report in PDF.",
  keywords: [
    "ielts speaking practice",
    "ielts mock test",
    "ielts band score",
    "ielts AI test",
    "ielts feedback",
    "ielts speaking part 1 2 3",
    "SpeakSmart AI",
    "ielts speaking mock test",
    "ielts speaking practice test",
    "ielts speaking test online",
    "ielts speaking test with ai",
    "ielts speaking test practice",
    "ielts speaking test questions",
    "ielts speaking test band score",
  ],
  openGraph: {
    title: "IELTS Speaking Practice Test | AI Band Evaluation | SpeakSmart",
    description:
      "Experience an AI-powered IELTS Speaking test. Get instant band feedback, detailed performance tips, and a downloadable report.",
    url: `${baseUrl}/ielts-speaking`,
    siteName: "SpeakSmart AI",
    images: [
      {
        url: `${baseUrl}/images/ielts-speaking-ai.jpg`,
        width: 1200,
        height: 630,
        alt: "IELTS Speaking Test with AI",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IELTS Speaking Practice Test | SpeakSmart AI",
    description:
      "Boost your IELTS Speaking score with AI feedback, instant band evaluation, and personalized tips.",
    images: [`${baseUrl}/images/ielts-speaking-ai.jpg`],
  },
  alternates: {
    canonical: `${baseUrl}/ielts-speaking`,
  },
};

export default function IELTSQuestions() {
  return <IELTSSpeakingPage baseUrl={baseUrl} />;
}
