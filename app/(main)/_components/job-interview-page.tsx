"use client";
import React, { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { toast } from "sonner";
import { MicPermissionDialog } from "@/components/main/mic-permission-dialog";
import { useRouter } from "next/navigation";

interface JobInterviewPageProps {
  baseUrl: string;
}

// Constants for maintainability
const ANIMATION_CONFIG = {
  duration: 0.8,
  stagger: 0.2,
  ease: "power3.out" as const,
} as const;

const SCHEMA_CONFIG = {
  context: "https://schema.org",
  type: "EducationalOrganization",
  name: "SpeakSmart AI",
  description: "SpeakSmart AI provides AI-powered job interview practice, feedback, and performance reports.",
  socialLinks: ["/twitter", "/youtube", "/instagram"],
} as const;

const JobInterviewPage: React.FC<JobInterviewPageProps> = ({ baseUrl }) => {

  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const [showDialog, setShowDialog] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  
  const router = useRouter();
  
  useGSAP(() => {
    const timeline = gsap.timeline({
      defaults: { 
        ease: ANIMATION_CONFIG.ease, 
        duration: ANIMATION_CONFIG.duration 
      },
    });

    timeline
      .from(titleRef.current, { opacity: 0, y: -40 })
      .from(sectionsRef.current, { opacity: 0, y: 40, stagger: ANIMATION_CONFIG.stagger }, "-=0.3")
      .from(buttonRef.current, { opacity: 0, scale: 0.8, y: 20, ease: "elastic.out(1, 0.6)", duration: 1.2 });
  }, []);

  // Ref callback
  const setSectionRef = useCallback((index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  }, []);

  // Structured Data
  const schemaData = {
    "@context": SCHEMA_CONFIG.context,
    "@type": SCHEMA_CONFIG.type,
    name: SCHEMA_CONFIG.name,
    url: baseUrl,
    description: SCHEMA_CONFIG.description,
    sameAs: SCHEMA_CONFIG.socialLinks.map(platform => `${baseUrl}${platform}`),
    offers: {
      "@type": "Offer",
      name: "AI-Powered Job Interview Practice",
      description: "Prepare for job interviews with AI-based practice questions, instant feedback, and downloadable performance reports.",
      url: `${baseUrl}/job-interview`,
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

         const topic =
        selectedField === "Other" && customTopic
          ? customTopic
          : selectedField;

        if (!topic) {
          toast.warning("Please select or enter a field before starting.");
          return;
        }
        
        sessionStorage.setItem("allowSpeech", "true");
        sessionStorage.setItem("userField", topic);
        setShowDialog(false);
        router.push("/job-interview/exam");
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
          AI-Powered Job Interview Preparation
        </h1>
        
        <section
          ref={setSectionRef(0)}
          className="text-sm md:text-base text-gray-600 leading-relaxed"
        >
          <p>
            Practice common job interview questions, get AI-powered feedback, 
            and improve your confidence and performance. Receive a full performance 
            report to track your progress and prep effectively for real interviews.
          </p>
        </section>
      </header>

      {/* Rules & Guidelines Section */}
      <section
        ref={setSectionRef(1)}
        className="bg-white shadow-md rounded-2xl p-4 md:p-8 mb-10 border border-gray-100"
      >
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
          🧾 Interview Practice Guidelines
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm md:text-base text-justify">
          <li>
            The practice includes <strong>common interview questions</strong> across different industries and roles.
          </li>
          <li>
            Each question adapts to your answers, simulating a realistic interview experience.
          </li>
          <li>
            SpeakSmart AI acts as your <strong>virtual interviewer</strong>, evaluating your fluency, confidence, and answer quality.
          </li>
          <li>
            Receive <strong>instant feedback</strong> and suggestions after each question to improve naturally.
          </li>
          <li>
            At the end, download a <strong>performance report (PDF)</strong> containing strengths, weaknesses, and tips for improvement.
          </li>
          <li>
            Track your progress over time and prepare effectively for real job interviews.
          </li>
        </ul>
      </section>

      {/* Flow Section */}
      <section
        ref={setSectionRef(2)}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-2 md:p-8 mb-10"
      >
        <h2 className="text-xl md:text-2xl font-semibold my-6 text-blue-800">
          🎯 How the AI Interview Practice Works
        </h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 text-sm md:text-base text-justify">
          <li>Click <strong>Start Practice</strong> to begin.</li>
          <li>Answer 7-10 questions about yourself and your experience.</li>
          <li>Each answer is evaluated using <strong>AI scoring and feedback</strong>.</li>
          <li>Download your <strong>Performance Report PDF</strong> with tips and improvement areas.</li>
        </ol>
      </section>

      <section
        ref={setSectionRef(1)}
        className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-8 border border-gray-100"
      >
        <h2 className="text-base md:text-xl font-semibold mb-3">🎓 Select Your Field</h2>
        <select
          className="w-full border text-xs md:text-sm cursor-pointer border-gray-300 rounded-md p-1 md:p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
        >
          <option value="">-- Select your field --</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Marketing & Sales">Marketing & Sales</option>
          <option value="Finance & Accounting">Finance & Accounting</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Operations & Logistics">Operations & Logistics</option>
          <option value="Design & Creative">Design & Creative</option>
          <option value="Other">Other</option>
        </select>
         {selectedField === "Other" && (
          <input
            type="text"
            placeholder="Enter your custom topic..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="w-full mt-3 border text-xs md:text-sm border-gray-300 rounded-md p-1.5 md:p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        )}
        <p className="text-xs text-gray-500 mt-2">Your interview questions will be customized accordingly.</p>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div ref={buttonRef}>
          <Button 
            className="w-full md:w-fit"
            aria-label="Start AI Job Interview Practice"
            onClick={() => setShowDialog(true)}
          >
            🚀 Start AI Job Interview Practice
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-4">
          Powered by <strong>SpeakSmart AI</strong> — Your Personal Interview Coach.
        </p>
      </section>

       { showDialog && ( 
          <MicPermissionDialog 
            title='🎤 Allow Microphone Access'
            description='We need access to your microphone to record your Job Interview answers.  
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

export default JobInterviewPage;
