"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent } from "@/components/ui/card";
import { steps } from "@/data";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entrance animation
      gsap.fromTo(sectionRef.current, 
        {
          opacity: 0,
          y: 50
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
            toggleActions: "play none none reverse"
          }
        }
      );

      // Title animation
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 30
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
            toggleActions: "play none none reverse"
          }
        }
      );

      // Description animation
      gsap.fromTo(descRef.current,
        {
          opacity: 0,
          y: 20
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
            toggleActions: "play none none reverse"
          }
        }
      );

      // Steps staggered animation - horizontal slide for desktop, vertical for mobile
      gsap.fromTo(".how-step",
        {
          opacity: 0,
          x: index => {
            // For desktop: alternate left/right slide
            if (window.innerWidth >= 768) {
              return index % 2 === 0 ? -60 : 60;
            }
            // For mobile: slide up from bottom
            return 0;
          },
          y: index => {
            if (window.innerWidth < 768) {
              return 60;
            }
            return 0;
          },
          scale: 0.8
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 80%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Icon animation with bounce effect
      gsap.fromTo(".how-step .bg-indigo-50",
        {
          scale: 0,
          rotation: -90
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.8)",
          stagger: 0.15,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 75%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Sequential text reveal for step content
      gsap.fromTo(".how-step h3, .how-step p",
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 70%",
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
      className="how-section py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
        >
          How SpeakSmart AI Works
        </h2>
        <p 
          ref={descRef}
          className="text-gray-600 max-w-2xl mx-auto mb-12 text-xs sm:text-sm md:text-base"
        >
          SpeakSmart AI makes your IELTS speaking practice effortless — from
          recording to personalized evaluation in just a few seconds.
        </p>

        <div 
          ref={stepsRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-4"
        >
          {steps.map((step, index) => (
            <Card
              key={index}
              className="how-step p-4 md:p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl border border-gray-100 rounded-3xl"
            >
              <div className="mb-0 md:mb-3 bg-indigo-50 p-2 md:p-4 rounded-full">
                {step.icon}
              </div>
              <CardContent className="p-0">
                <h3 className="text-base md:text-xl font-semibold mb-1">{step.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}