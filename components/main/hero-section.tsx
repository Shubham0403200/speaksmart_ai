'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

export default function HeroSection() {
  // GSAP Animation Timeline
  useGSAP(() => {
    const timeline = gsap.timeline();

    // 1️⃣ H1 animation (slide from left)
    timeline.from(".hero-h1", {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // 2️⃣ Paragraph animation (fade up)
    timeline.from(".hero-p", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.5"); // overlap a bit with H1

    // 3️⃣ Buttons animation (scale & fade)
    timeline.from(".hero-buttons > *", {
      opacity: 0,
      scale: 0.8,
      stagger: 0.2,
      duration: 0.6,
      ease: "back.out(1.7)",
    }, "-=0.3");

    // 4️⃣ Card animation (slide from right)
    timeline.from(".hero-card", {
      x: 100,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: "power4.out",
    }, "-=0.4"); // overlap slightly
  }, []);

  return (
    <section className="relative min-h-screen bg-white flex flex-col md:flex-row items-center justify-center px-5 sm:px-8 md:px-16 gap-10 overflow-hidden mx-auto max-w-7xl">

      {/* Left Text Section */}
      <div className="flex-1 text-center md:text-left space-y-6 mt-32 md:mt-0">
        <h1 className="hero-h1 text-4xl md:text-6xl font-extrabold leading-snug text-gray-900 bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
          Practice. Perfect. Perform.
        </h1>

        <p className="hero-p text-gray-600 max-w-md sm:max-w-xl text-xs sm:text-sm md:text-base mx-auto md:mx-0">
          SpeakSmart AI helps you improve spoken English — IELTS speaking, interview practice, and conversational fluency. Get instant, actionable feedback and downloadable reports. Free — no login required.
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row md:flex-row justify-center md:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
          <Link href='/ielts-speaking'>
            <Button
              className="bg-black text-white hover:bg-gray-800 hover:scale-105 transition-transform w-full sm:w-auto rounded-full px-5 py-3 text-sm shadow-lg"
            >
              Start IELTS Practice
            </Button>
          </Link>
          <Link href='/job-interview'>
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-full px-5 py-3 text-sm border-gray-300 hover:border-gray-800 hover:text-gray-900 hover:scale-105 transition-transform"
            >
              Try Interview Mode
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Card Section */}
      <div className="flex-1 flex justify-center hero-card">
        <Card className="max-w-sm sm:max-w-md w-full shadow-2xl border border-gray-100 bg-white/70 backdrop-blur-md rounded-2xl transition-transform hover:scale-105 hover:shadow-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md transition-transform hover:scale-110">
                SS
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Instant Speaking Feedback</h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Record answers, get a band estimate and improvement tips.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 mb-5">
              <span className="font-medium">Sample question:</span> Describe a memorable trip you took. You should say: where you went, who you went with, what you did, and explain why it was memorable.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl hover:scale-105 transition-transform">
                Play
              </Button>
              <Link href='/ielts'>
                <Button className="bg-black text-white hover:bg-gray-800 hover:scale-105 transition-transform w-full sm:w-auto rounded-xl">
                  Practice Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
