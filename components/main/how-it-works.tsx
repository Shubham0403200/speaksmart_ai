"use client";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Mic, FileText, Gauge, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

gsap.registerPlugin(useGSAP);

const steps = [
  {
    icon: <Mic className="w-10 h-10 text-indigo-600" />,
    title: "Record",
    description:
      "Answer the question using your microphone — no login required.",
  },
  {
    icon: <FileText className="w-10 h-10 text-indigo-600" />,
    title: "Transcribe",
    description:
      "We convert your speech to text instantly and display it for you.",
  },
  {
    icon: <Gauge className="w-10 h-10 text-indigo-600" />,
    title: "Evaluate",
    description:
      "Our AI analyzes your response and gives you a band score with tips.",
  },
  {
    icon: <ArrowUpRight className="w-10 h-10 text-indigo-600" />,
    title: "Improve",
    description:
      "Download a detailed report and retry to track your improvement.",
  },
];

export default function HowItWorks() {
  useGSAP(() => {
    gsap.from(".how-step", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".how-section",
        start: "top 85%",
      },
    });
  });

  return (
    <section className="how-section py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          How SpeakSmart AI Works
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-sm sm:text-base">
          SpeakSmart AI makes your IELTS speaking practice effortless — from
          recording to personalized evaluation in just a few seconds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="how-step p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl border border-gray-100"
            >
              <div className="mb-4 bg-indigo-50 p-4 rounded-full">
                {step.icon}
              </div>
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
