'use client';
import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqsData } from "@/data";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FAQSection = () => {

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".accordion-section",
        start: "top bottom", // Start when section enters viewport
        end: "bottom 85%", 
        scrub: 0.1, // smooth scroll-based animation
      },
    });

    // Animate heading
    tl.from(".accordion-heading", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Animate accordion items staggered
    tl.from(".accordion-main > .accordion-item", {
      y: 30,
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      stagger: 0.15,
      ease: "power3.out",
    }, "-=0.3");
  }, { dependencies: [] });

  return (
    <section className="accordion-section relative max-w-5xl mx-auto py-20 px-6 sm:px-10">
      {/* Gradient Glow Background */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(147, 197, 253, 0.5) 0%, rgba(139, 92, 246, 0.2) 100%)",
        }}
      ></div>

      {/* Heading */}
      <h1 className="accordion-heading relative text-3xl md:text-4xl leading-tight font-extrabold text-center mb-12 text-gray-900 z-10">
        Frequently Asked Questions
      </h1>

      {/* Accordion */}
      <Accordion type="single" collapsible className="accordion-main w-full space-y-4 relative z-10">
        {faqsData.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="accordion-item bg-white/90 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <AccordionTrigger className="px-5 py-4 text-left text-gray-900 text-sm sm:text-base font-medium hover:bg-indigo-50 transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 text-gray-700 text-xs sm:text-sm leading-relaxed mt-2">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;
