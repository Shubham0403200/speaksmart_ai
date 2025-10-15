// app/ielts-exam/page.tsx
import React from "react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 mt-24 text-gray-800">

      {/* Primary Heading */}
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-6 text-center">
        IELTS Speaking Practice Test with AI
      </h1>

      {/* Intro Section */}
      <section className="text-sm md:text-base text-gray-600 text-center mb-10 leading-relaxed">
        <p>
          Take a full-length IELTS Speaking test, get
          AI-powered <strong>band feedback</strong>, and improve your
          performance with instant suggestions and a final downloadable report.
        </p>
      </section>

      {/* Rules Section */}
      <section className="bg-white shadow-md rounded-2xl p-4 md:p-8 mb-10 border border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">🧾 Test Rules & Guidelines</h2>
<ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm md:text-base text-justify">
  <li>
    The IELTS Speaking Test includes <strong>three parts</strong> designed to assess your fluency, pronunciation, and confidence in real-life situations.
  </li>
  <li>
    Each part features <strong>realistic IELTS-style questions</strong> that adapt to your speaking level.
  </li>
  <li>
    SpeakSmart AI acts as your personal <strong>virtual examiner</strong>, guiding you through all three parts.
  </li>
  <li>
    You’ll receive <strong>instant evaluation</strong> after each section — helping you improve your responses naturally.
  </li>
  <li>
    At the end of the test, you can <strong>download your performance report (PDF)</strong> containing feedback and suggestions for improvement.
  </li>
  <li>
    Use this tool regularly to <strong>track your progress</strong> and prepare effectively for the real IELTS Speaking exam.
  </li>
</ul>
      </section>

      {/* Flow Section */}
      <section className="bg-blue-50 border border-blue-200 rounded-2xl p-2 md:p-8 mb-10">
        <h2 className="text-xl md:text-2xl font-semibold my-6 text-blue-800">
          🎤 How the IELTS AI Speaking Test Works
        </h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 text-sm md:text-base text-justify">
          <li>Click <strong>“Start Test”</strong> to begin.</li>
          <li>SpeakSmart AI will ask you Part 1 questions.</li>
          <li>
            Continue with <strong>Part 2 (Cue Card)</strong> and{" "}
            <strong>Part 3 (Follow-up)</strong>.
          </li>
          <li>
            Each answer is evaluated using <strong>AI-based scoring</strong>.
          </li>
          <li>Receive your <strong>Band Score Report PDF</strong> instantly.</li>
        </ol>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Link href='/ielts-speaking/exam'>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 py-4 w-full md:w-fit">
            🚀 Start IELTS Speaking Test 
          </Button>
        </Link>
        <p className="text-xs sm:text-sm text-gray-500 mt-4">
          Powered by <strong>SpeakSmart AI</strong> — Your Personal IELTS
          Speaking Coach.
        </p>
      </section>

      {/* Hidden JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "SpeakSmart AI",
            url: baseUrl,
            description:
              "SpeakSmart AI provides IELTS Speaking practice tests with AI-powered feedback, instant band evaluation, and performance analytics.",
            sameAs: [
              `${baseUrl}/twitter`,
              `${baseUrl}/youtube`,
              `${baseUrl}/instagram`,
            ],
            offers: {
              "@type": "Offer",
              name: "IELTS Speaking Practice Test",
              description:
                "Take an AI-powered IELTS Speaking Test and receive instant feedback, band score, and downloadable performance report.",
              url: `${baseUrl}/ielts-speaking`,
            },
          }),
        }}
      />
    </main>
  );
}
