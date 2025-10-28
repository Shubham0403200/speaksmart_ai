"use client";
import React, { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { toast } from "sonner";
import { MicPermissionDialog } from "@/components/main/mic-permission-dialog";
import { useRouter } from "next/navigation";

interface SpeakingPageProps {
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
  description:
    "SpeakSmart AI helps users improve English speaking, fluency, and pronunciation through AI-powered communication practice and instant feedback.",
  socialLinks: ["/twitter", "/youtube", "/instagram"],
} as const;

const SpeakingPage: React.FC<SpeakingPageProps> = ({ baseUrl }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const router = useRouter();

  useGSAP(() => {
    const timeline = gsap.timeline({
      defaults: {
        ease: ANIMATION_CONFIG.ease,
        duration: ANIMATION_CONFIG.duration,
      },
    });

    timeline
      .from(titleRef.current, { opacity: 0, y: -40 })
      .from(
        sectionsRef.current,
        { opacity: 0, y: 40, stagger: ANIMATION_CONFIG.stagger },
        "-=0.3"
      )
      .from(buttonRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        ease: "elastic.out(1, 0.6)",
        duration: 1.2,
      });
  }, []);

  const setSectionRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      sectionsRef.current[index] = el;
    },
    []
  );

  const schemaData = {
    "@context": SCHEMA_CONFIG.context,
    "@type": SCHEMA_CONFIG.type,
    name: SCHEMA_CONFIG.name,
    url: baseUrl,
    description: SCHEMA_CONFIG.description,
    sameAs: SCHEMA_CONFIG.socialLinks.map(
      (platform) => `${baseUrl}${platform}`
    ),
    offers: {
      "@type": "Offer",
      name: "AI-Powered Speaking & Communication Practice",
      description:
        "Enhance English speaking and communication with AI. Practice real-life topics, get instant feedback, and improve fluency, pronunciation, and vocabulary.",
      url: `${baseUrl}/speaking`,
    },
  };

  const handleAllowMic = async () => {
    try {
      const ua: string =
        navigator.userAgent ||
        (navigator.vendor ?? "") ||
        (typeof window !== "undefined" && "opera" in window ? "opera" : "");

      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

      if (isIOS || isSafari) {
        toast.info("🚧 Still under development for iOS / Safari devices.");
        setShowDialog(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const topic =
        selectedTopic === "Other" && customTopic
          ? customTopic
          : selectedTopic;

      if (!topic) {
        toast.warning("Please select or enter a topic before starting.");
        return;
      }

      sessionStorage.setItem("allowSpeech", "true");
      sessionStorage.setItem("userTopic", topic);
      setShowDialog(false);
      router.push("/speaking/exam");
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
    toast.error("Access Needed.");
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 mt-24 text-gray-800">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1
          ref={titleRef}
          className="text-2xl md:text-4xl font-bold tracking-tight mb-6"
        >
          AI-Powered Speaking & Communication Practice
        </h1>

        <section
          ref={setSectionRef(0)}
          className="text-sm md:text-base text-gray-600 leading-relaxed"
        >
          <p>
            Improve your English fluency, pronunciation, and communication
            skills with SpeakSmart AI. Practice real-life speaking topics,
            receive instant feedback, and get actionable tips to speak
            naturally and confidently.
          </p>
        </section>
      </header>

      {/* Guidelines Section */}
      <section
        ref={setSectionRef(1)}
        className="bg-white shadow-md rounded-2xl p-4 md:p-8 mb-10 border border-gray-100"
      >
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
          🧾 Speaking Practice Guidelines
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm md:text-base text-justify">
          <li>
            The session includes <strong>10 speaking questions</strong> on
            real-world topics.
          </li>
          <li>
            You’ll receive <strong>AI feedback</strong> on fluency,
            pronunciation, grammar, and vocabulary.
          </li>
          <li>
            The AI acts as your <strong>conversation partner</strong>, helping
            you practice naturally.
          </li>
          <li>
            After the test, you’ll see a <strong>Predicted Band Score</strong>{" "}
            and <strong>Instant Tips</strong> for improvement.
          </li>
          <li>
            Get a <strong>Performance Report (PDF)</strong> summarizing your
            results and progress.
          </li>
        </ul>
      </section>

      {/* Flow Section */}
      <section
        ref={setSectionRef(2)}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-2 md:p-8 mb-10"
      >
        <h2 className="text-xl md:text-2xl font-semibold my-6 text-blue-800">
          🎯 How It Works
        </h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 text-sm md:text-base text-justify">
          <li>Click <strong>Start Practice</strong> below.</li>
          <li>Choose a topic or enter your own.</li>
          <li>Answer 10 AI-generated questions on that topic.</li>
          <li>Get instant scores and tips to improve your fluency.</li>
          <li>Download your <strong>Performance Report PDF</strong>.</li>
        </ol>
      </section>

      {/* Topic Selection */}
      <section
        ref={setSectionRef(3)}
        className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-8 border border-gray-100"
      >
        <h2 className="text-base md:text-xl font-semibold mb-3">
          🎙️ Choose Your Speaking Topic
        </h2>
        <select
          className="w-full border text-xs md:text-sm cursor-pointer border-gray-300 rounded-md p-1 md:p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">-- Select a topic --</option>
          <option value="Daily Life">Daily Life</option>
          <option value="Technology">Technology</option>
          <option value="Travel & Culture">Travel & Culture</option>
          <option value="Education">Education</option>
          <option value="Work & Career">Work & Career</option>
          <option value="Environment">Environment</option>
          <option value="Health & Lifestyle">Health & Lifestyle</option>
          <option value="Social Media">Social Media</option>
          <option value="Movies & Entertainment">Movies & Entertainment</option>
          <option value="Other">Other</option>
        </select>

        {selectedTopic === "Other" && (
          <input
            type="text"
            placeholder="Enter your custom topic..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="w-full mt-3 border text-xs md:text-sm border-gray-300 rounded-md p-1.5 md:p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        )}

        <p className="text-xs text-gray-500 mt-2">
          Your questions will be customized based on the topic you select.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div ref={buttonRef}>
          <Button
            className="w-full md:w-fit"
            aria-label="Start AI Speaking Practice"
            onClick={() => setShowDialog(true)}
          >
            🚀 Start AI Speaking Practice
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-4">
          Powered by <strong>SpeakSmart AI</strong> — Your Personal Speaking
          Coach.
        </p>
      </section>

      {/* Microphone Permission Dialog */}
      {showDialog && (
        <MicPermissionDialog
          title="🎤 Allow Microphone Access"
          description="We need access to your microphone to record your speaking answers. Please tap below to continue."
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

export default SpeakingPage;
