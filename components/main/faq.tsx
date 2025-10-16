"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqsData } from "@/data";

gsap.registerPlugin(ScrollTrigger);

const FAQSection = () => {
  
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background glow animation
      gsap.fromTo(backgroundRef.current,
        {
          scale: 0.8,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 0.2,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Section entrance animation
      gsap.fromTo(sectionRef.current,
        {
          opacity: 0,
          y: 40
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

      // Heading animation
      gsap.fromTo(headingRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Accordion items staggered animation
      gsap.fromTo(".accordion-item",
        {
          opacity: 0,
          y: 50,
          x: -20
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          stagger: {
            amount: 0.4,
            from: "start"
          },
          ease: "power2.out",
          scrollTrigger: {
            trigger: accordionRef.current,
            start: "top 85%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Subtle scale animation for accordion items on enter
      gsap.fromTo(".accordion-item",
        {
          scale: 0.95
        },
        {
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: accordionRef.current,
            start: "top 80%",
            end: "bottom 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate the border and shadow when items enter
      gsap.fromTo(".accordion-item",
        {
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          borderColor: "rgba(229, 231, 235, 0)"
        },
        {
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          borderColor: "rgba(229, 231, 235, 1)",
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: accordionRef.current,
            start: "top 75%",
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
      className="accordion-section relative max-w-5xl mx-auto py-20 px-6 sm:px-10"
    >
      <div
        ref={backgroundRef}
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(147, 197, 253, 0.5) 0%, rgba(139, 92, 246, 0.2) 100%)",
        }}
      ></div>
      
      <h1 
        ref={headingRef}
        className="accordion-heading relative text-2xl sm:text-3xl md:text-4xl leading-tight font-extrabold text-center mb-5 md:mb-10 text-gray-900 z-10"
      >
        Frequently Asked Questions
      </h1>
      
      <Accordion 
        ref={accordionRef}
        type="single" 
        collapsible 
        className="accordion-main w-full space-y-2 relative z-10"
      >
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