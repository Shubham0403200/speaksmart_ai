'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardRef.current) return;

    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        end: "bottom 15%",
        scrub: false,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cta-section py-24 bg-white flex justify-center items-center"
    >
      <div
        ref={cardRef}
        className="bg-white rounded-2xl shadow-lg p-12 md:p-16 max-w-3xl text-center border border-gray-100"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Ready to speak confidently?
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6 text-xs sm:text-base">
          Start your free speaking session now — no login required. Practice anywhere, anytime, and get instant feedback.
        </p>
        <Button
          size="lg"
          className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-xs sm:text-sm font-medium rounded-full transition-transform hover:scale-105"
        >
          Start Free Practice
        </Button>
      </div>
    </section>
  );
}
