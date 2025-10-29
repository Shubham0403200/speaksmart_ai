"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeedbackPreview from "@/components/main/feedback";
import DemoModal from "./demo-modal";

gsap.registerPlugin(ScrollTrigger);

const FeedbackComponent = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const feedback = sectionRef.current?.querySelector(".feedback-card");
    const demo = sectionRef.current?.querySelector(".demo-card");

    if (feedback) {
      gsap.fromTo(
        feedback,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: feedback,
            start: "top 85%",
            end: "bottom 30%",
            scrub: true,
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }

    if (demo) {
      gsap.fromTo(
        demo,
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: demo,
            start: "top 85%",
            end: "bottom 30%",
            scrub: true,
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mt-12 grid md:grid-cols-2 gap-6 items-start p-4 md:p-6 mx-auto max-w-6xl"
    >
      <div className="feedback-card">
        <FeedbackPreview />
      </div>
      <div className="demo-card">
        <DemoModal />
      </div>
    </div>
  );
};

export default FeedbackComponent;
