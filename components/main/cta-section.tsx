"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from "@/components/ui/button";
import { playfair } from "./logo";
import { cn } from "@/lib/utils";
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clean container entrance - just fade and subtle scale
      gsap.fromTo(containerRef.current,
        {
          opacity: 0,
          scale: 0.98,
          y: 20
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(headingRef.current,
        {
          opacity: 0,
          y: 15
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Text - clean fade up
      gsap.fromTo(textRef.current,
        {
          opacity: 0,
          y: 10
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Button - clean fade up with subtle scale
      gsap.fromTo(buttonRef.current,
        {
          opacity: 0,
          y: 10,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          delay: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="cta-section py-16 md:py-24 bg-white flex justify-center items-center px-6"
    >
      <div 
        ref={containerRef}
        className="bg-white rounded-2xl shadow-xl hover:shadow-2xl p-8  md:p-16 max-w-3xl text-center border border-gray-100"
      >
        <h2 
          ref={headingRef}
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
        >
          Ready to speak confidently?
        </h2>
        <p 
          ref={textRef}
          className="text-gray-600 max-w-xl mx-auto mb-6 text-xs sm:text-base"
        >
          Start your free speaking session now — no login required. Practice anywhere, anytime, and get instant feedback.
        </p>
        <Link href='/ielts-speaking'>
          <Button
            ref={buttonRef}
            size="lg"
            className={cn("bg-black hover:bg-gray-800 text-white px-8 py-4 text-xs sm:text-sm font-medium rounded-full transition-transform hover:scale-105", playfair.className)}
          >
            Start Free Practice
          </Button>
        </Link>
      </div>
    </section>
  );
}