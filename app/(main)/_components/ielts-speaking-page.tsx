"use client";
import React, { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import { MicPermissionDialog } from "@/components/main/mic-permission-dialog";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface IELTSSpeakingPageProps {
  baseUrl: string;
}

const ANIMATION_CONFIG = {
  duration: 0.8,
  stagger: 0.2,
  ease: "power3.out" as const,
} as const;

const SCHEMA_CONFIG = {
  context: "https://schema.org",
  type: "EducationalOrganization",
  name: "SpeakSmart AI",
  description: "SpeakSmart AI provides IELTS Speaking practice tests with AI-powered feedback, instant band evaluation, and performance analytics.",
  socialLinks: ["/twitter", "/youtube", "/instagram"],
} as const;

const IELTSSpeakingPage: React.FC<IELTSSpeakingPageProps> = ({ baseUrl }) => {
  // Refs with proper typing
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();
  
  useGSAP(() => {
    const timeline = gsap.timeline({
      defaults: { 
        ease: ANIMATION_CONFIG.ease, 
        duration: ANIMATION_CONFIG.duration 
      },
    });

    timeline
      .from(titleRef.current, { 
        opacity: 0, 
        y: -40 
      })
      .from(sectionsRef.current, { 
        opacity: 0, 
        y: 40, 
        stagger: ANIMATION_CONFIG.stagger 
      }, "-=0.3")
      .from(buttonRef.current, { 
        opacity: 0, 
        scale: 0.8, 
        y: 20, 
        ease: "elastic.out(1, 0.6)", 
        duration: 1.2 
      });
  }, []);

  // Ref callback with useCallback for optimization
  const setSectionRef = useCallback((index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  }, []);

  // Schema data
  const schemaData = {
    "@context": SCHEMA_CONFIG.context,
    "@type": SCHEMA_CONFIG.type,
    name: SCHEMA_CONFIG.name,
    url: baseUrl,
    description: SCHEMA_CONFIG.description,
    sameAs: SCHEMA_CONFIG.socialLinks.map(platform => `${baseUrl}${platform}`),
    offers: {
      "@type": "Offer",
      name: "IELTS Speaking Practice Test",
      description: "Take an AI-powered IELTS Speaking Test and receive instant feedback, band score, and downloadable performance report.",
      url: `${baseUrl}/ielts-speaking`,
    },
  };

    const handleAllowMic = async () => {
    try {
    
      const ua: string = navigator.userAgent || (navigator.vendor ?? "") || (typeof window !== "undefined" && "opera" in window ? "opera" : "");
      
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

      if (isIOS || isSafari)  {
        toast.info("🚧 Still under development for iOS / Safari devices.");
        setShowDialog(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      sessionStorage.setItem("allowSpeech", "true");
      setShowDialog(false);
      router.push("/ielts-speaking/exam");
    } catch (err) {
      console.error("❌ Microphone access denied:", err);
      toast.warning(
        "Please allow microphone access in browser settings before starting the test."
      );
      setShowDialog(false);
    }
  };

    const handleCancel = () => {
      setShowDialog(false);
      toast.error('Access Needed.');
    };

  return (
      <main className="max-w-5xl mx-auto px-6 py-12 mt-24 text-gray-800">

        {/* Header Section */}
        <header className="text-center mb-10">
          <h1
            ref={titleRef}
            className="text-2xl md:text-4xl font-bold tracking-tight mb-6"
          >
            IELTS Speaking Practice Test with AI
          </h1>
          
          <section
            ref={setSectionRef(0)}
            className="text-sm md:text-base text-gray-600 leading-relaxed"
          >
            <p>
              Take a full-length IELTS Speaking test, get AI-powered{" "}
              <strong>band feedback</strong>, and improve your performance with
              instant suggestions and a final downloadable report.
            </p>
          </section>
        </header>

        {/* Rules & Guidelines Section */}
        <section
          ref={setSectionRef(1)}
          className="bg-white shadow-md rounded-2xl p-4 md:p-8 mb-10 border border-gray-100"
        >
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
            🧾 Test Rules & Guidelines
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm md:text-base text-justify">
            <li>
              The IELTS Speaking Test includes <strong>three parts</strong>{" "}
              designed to assess your fluency, pronunciation, and confidence in
              real-life situations.
            </li>
            <li>
              Each part features <strong>realistic IELTS-style questions</strong>{" "}
              that adapt to your speaking level.
            </li>
            <li>
              SpeakSmart AI acts as your personal{" "}
              <strong>virtual examiner</strong>, guiding you through all three
              parts.
            </li>
            <li>
              You&apos;ll receive <strong>instant evaluation</strong> after each
              section — helping you improve your responses naturally.
            </li>
            <li>
              At the end of the test, you can{" "}
              <strong>download your performance report (PDF)</strong> containing
              feedback and suggestions for improvement.
            </li>
            <li>
              Use this tool regularly to <strong>track your progress</strong> and
              prepare effectively for the real IELTS Speaking exam.
            </li>
          </ul>
        </section>

        {/* Flow Section */}
        <section
          ref={setSectionRef(2)}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-2 md:p-8 mb-10"
        >
          <h2 className="text-xl md:text-2xl font-semibold my-6 text-blue-800">
            🎤 How the IELTS AI Speaking Test Works
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 text-sm md:text-base text-justify">
            <li>
              Click <strong>Start Test</strong> to begin.
            </li>
            <li>SpeakSmart AI will ask you Part 1 questions.</li>
            <li>
              Continue with <strong>Part 2 (Cue Card)</strong> and{" "}
              <strong>Part 3 (Follow-up)</strong>.
            </li>
            <li>
              Each answer is evaluated using <strong>AI-based scoring</strong>.
            </li>
            <li>
              Receive your <strong>Band Score Report PDF</strong> instantly.
            </li>
          </ol>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div ref={buttonRef}> 
              <Button 
                className="w-full md:w-fit"
                aria-label="Start IELTS Speaking Test"
                  onClick={() => setShowDialog(true)}
              >
                🚀 Start IELTS Speaking Test
              </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-4">
            Powered by <strong>SpeakSmart AI</strong> — Your Personal IELTS
            Speaking Coach.
          </p>
        </section>

        { showDialog && ( 
          <MicPermissionDialog 
            title='🎤 Allow Microphone Access'
            description='We need access to your microphone to record your IELTS Speaking answers.  
              Please tap  to continue'
            open={showDialog}
            onOpenChange={setShowDialog}
            buttonText="Allow"
            onClick={handleAllowMic}
            onCancel={handleCancel}
          />
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </main>
  );
};

export default IELTSSpeakingPage;