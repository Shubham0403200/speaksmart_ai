"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "@/components/ui/button";
import { speakText } from "@/lib/tts-openai";

interface EvaluationResult {
  band: number;
  feedback: string;
  band9_answer: string;
}


const IELTSExamPage = () => {
  const [questions, setQuestions] = useState<{ part1?: string[]; part2?: string[]; part3?: string[] }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<"part1" | "part2" | "part3">("part1");
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // 🧠 STEP 1: Generate Questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/generate-questions/ielts", { method: "POST" });
        const data = await res.json();
        setQuestions(data);
        setIsLoading(false);

        // Start the test after loading questions
        if (data.part1 && data.part1.length > 0) {
          playQuestion(data.part1[0]);
        }
      } catch (error) {
        console.error("❌ Error loading questions:", error);
      }
    };

    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  // 🎤 STEP 2: Convert question text to audio using TTS
    const playQuestion = (text: string) => {
      setIsSpeaking(true);

      speakText(text, () => {
        setIsSpeaking(false);
        startListening();
      });
    };


  // 🎧 STEP 3: Start recording user’s answer
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: "en-IN", 
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  // 🧾 STEP 4: Evaluate user's answer
  const evaluateAnswer = async () => {
  stopListening();
  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion || !transcript) return;

  try {
    const res = await fetch("/api/evaluate-answers/ielts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: currentQuestion, userAnswer: transcript }),
    });

    const data: EvaluationResult = await res.json();
    setEvaluation(data);

    // Speak the evaluation
    const evaluationText = `Your band score is ${data.band}. Feedback: ${data.feedback}. Band nine model answer: ${data.band9_answer}`;
    speakText(evaluationText);

  } catch (err) {
    console.error("❌ Evaluation failed:", err);
  }
};


  // 🔁 STEP 5: Move to next question
  const nextQuestion = () => {
    setEvaluation(null);
    resetTranscript();

    const sectionQuestions = questions[currentSection];
    if (!sectionQuestions) return;

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < sectionQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      playQuestion(sectionQuestions[nextIndex]);
    } else {
      // Move to next section
      if (currentSection === "part1") setCurrentSection("part2");
      else if (currentSection === "part2") setCurrentSection("part3");
      else alert("🎉 Test Completed!");

      setCurrentQuestionIndex(0);
    }
  };

  const getCurrentQuestion = () => {
    return questions[currentSection]?.[currentQuestionIndex] || "";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 text-lg">
        <div className="animate-pulse">🎙️ Loading IELTS Speaking Questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        IELTS Speaking Test
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl text-center border border-gray-100">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          {currentSection.toUpperCase()} — Question {currentQuestionIndex + 1}
        </h2>

        <p className="text-lg font-semibold text-gray-800 mb-6">
          {getCurrentQuestion()}
        </p>

        {/* 🎶 AI Listening Animation */}
        <div className="flex justify-center gap-1 h-8 mb-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-indigo-500 rounded-full"
              animate={{
                height: listening
                  ? [10, 30, 15, 40, 20][i % 5]
                  : isSpeaking
                  ? [10, 20, 15, 25, 10][i % 5]
                  : 8,
              }}
              transition={{
                repeat: Infinity,
                duration: 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="text-sm text-gray-600 mb-4">
          {listening
            ? "🎧 AI is listening to your answer..."
            : isSpeaking
            ? "🔊 AI is asking the question..."
            : "Ready for next question!"}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border text-left mb-4 max-h-32 overflow-y-auto">
          <strong>Your Answer: </strong>
          <p className="text-gray-700">{transcript || "..."}</p>
        </div>

        {evaluation && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-left mb-4">
            <h3 className="font-semibold text-green-700 mb-1">
              Band: {evaluation.band}
            </h3>
            <p className="text-sm text-gray-800 mb-2">
              {evaluation.feedback}
            </p>
            <h4 className="font-semibold text-gray-700 mt-2">
              Band 9 Model Answer:
            </h4>
            <p className="text-sm text-gray-600">{evaluation.band9_answer}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={evaluateAnswer}
            disabled={!transcript}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            🧠 Evaluate Answer
          </Button>
          <Button
            onClick={nextQuestion}
            variant="outline"
            className="border-gray-300"
          >
            ⏭ Next Question
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        Powered by <strong>SpeakSmart AI</strong>
      </p>
    </div>
  );
};

export default IELTSExamPage;
