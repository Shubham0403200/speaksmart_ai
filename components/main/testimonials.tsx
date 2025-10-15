"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function Testimonials() {
  const testRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (testRef.current) {
      gsap.from(testRef.current.children, {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
      });
    }
  }, []);

  const testimonials = [
    {
      quote: "SpeakSmart AI helped me prepare for my IELTS in just 2 weeks!",
      name: "Riya Sharma",
    },
    {
      quote: "The job interview feature feels like talking to a real HR manager.",
      name: "Arjun Mehta",
    },
    {
      quote: "I improved my daily English fluency — and it’s free!",
      name: "Anjali Verma",
    },
  ];

  return (
    <section ref={testRef} className="py-20 px-6 bg-gray-50 text-center" id="testimonials">
      <h2 className="text-4xl font-bold mb-12 text-gray-900">What Users Say</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <p className="italic text-gray-700 mb-4">“{t.quote}”</p>
            <h4 className="font-semibold text-gray-900">— {t.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
