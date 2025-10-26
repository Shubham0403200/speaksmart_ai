"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";
import { features } from "@/data";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            end: "bottom 95%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Title animation
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "bottom 95%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Description animation
      gsap.fromTo(
        descRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "bottom 95%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards staggered animation
      gsap.fromTo(
        ".feature-card",
        {
          opacity: 0,
          y: 40,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "bottom 95%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Number badges animation
      gsap.fromTo(
        ".feature-card .w-14", // Target the number circles
        {
          scale: 0,
          rotation: -180,
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.8)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            end: "bottom 95%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section
      ref={sectionRef}
      id='features'
      className="features-section bg-gray-50 py-20 px-6 sm:px-10 md:px-20 text-center overflow-hidden"
    >
      <h1
        ref={titleRef}
        className="features-title text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
      >
        What SpeakSmart AI Offers
      </h1>
      <p
        ref={descRef}
        className="features-desc text-gray-600 max-w-2xl mx-auto mb-12 text-xs sm:text-sm md:text-base"
      >
        SpeakSmart AI provides realistic IELTS speaking practice questions, instant feedback with band scores, and detailed performance tracking to improve your speaking skills.
      </p>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
      >
        {features.map((feature, idx) => (
          <Link key={idx} href={feature.href}>
            <Card className="feature-card rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all transform bg-white cursor-pointer">
              <CardContent className="p-4 md:p-6 flex flex-col items-center text-center space-y-2 md:space-y-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover:scale-110">
                  {idx + 1}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
