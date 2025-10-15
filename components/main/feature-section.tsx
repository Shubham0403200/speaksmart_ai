'use client';
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  // GSAP scroll-based animations
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".features-section",
        start: "top bottom",   // when section enters viewport
        end: "bottom 20%",     // when section leaves viewport
        scrub: 0.5,            // smooth scroll-based progress
      },
    });

    // Animate title
    tl.from(".features-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Animate paragraph
    tl.from(
      ".features-desc",
      {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // Animate cards staggered
    tl.from(
      ".feature-card",
      {
        y: 50,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=0.4"
    );
  }, { dependencies: [] });

  // Hover animation for cards
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".feature-card");

    items.forEach((el) => {
      const onEnter = () => {
        gsap.to(el, { scale: 1.05, y: -5, duration: 0.2, ease: "power3.out" });
      };
      const onLeave = () => {
        gsap.to(el, { scale: 1, y: 0, duration: 0.2, ease: "power3.out" });
      };
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      // Cleanup
      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    });
  }, []);

  const features = [
    {
      title: "IELTS Speaking Practice",
      description:
        "Practice IELTS speaking with AI feedback and get band scores with tips.",
      href: "/ielts-speaking",
    },
    {
      title: "AI Job Interview Prep",
      description:
        "Prepare for job interviews with AI-powered mock questions and real-time feedback.",
      href: "/interview",
    },
    {
      title: "AI Communication & Fluency",
      description:
        "Improve your spoken English and communication skills for daily conversations or presentations.",
      href: "/speaking",
    },
  ];

  return (
    <section className="features-section bg-gray-50 py-20 px-6 sm:px-10 md:px-20 text-center overflow-hidden">
      <h1 className="features-title text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
        What SpeakSmart AI Offers
      </h1>
      <p className="features-desc text-gray-600 max-w-2xl mx-auto mb-12 text-sm sm:text-base">
        SpeakSmart AI helps you practice English effectively. From IELTS practice to interview prep and general communication, every feature is designed to boost your confidence and fluency.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <Link key={idx} href={feature.href} className="group">
            <Card className="feature-card rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all transform bg-white cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover:scale-110">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
