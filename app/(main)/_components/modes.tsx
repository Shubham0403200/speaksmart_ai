"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const card = (title: string, sample: string, link: string) => (
  <div className="card bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
        {title[0]}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{sample}</p>
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <Link href={link}>
        <Button className="ml-auto">Start Practice</Button>
      </Link>
    </div>
  </div>
);

export default function Modes() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".card");

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 30%",
            scrub: true, 
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mt-12 grid md:grid-cols-3 px-4 md:px-6 gap-6 mx-auto max-w-6xl"
    >
      {card(
        "IELTS Speaking",
        "Describe an important decision you made.",
        "/ielts-speaking"
      )}
      {card(
        "Job Interview",
        "Tell me about a time you resolved a conflict.",
        "/job-interview"
      )}
      {card(
        "Daily Communication",
        "Practice small talk: weekend plans or other topics.",
        "/speaking"
      )}
    </section>
  );
}
