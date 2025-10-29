"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "@/components/ui/button";
import { speakText, checkMicrophoneAccess } from "@/lib/tts-openai";
import { AnswerRecord, EvaluationJobResult } from "@/components/interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DownloadFeedbackPDF } from "@/components/main/download-pdf";
import { useNavigationBlocker } from "@/components/hooks/use-navigation-blocker";
import { toast } from "sonner";

const JobInterviewPage = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationJobResult | null>(null);
  const [allAnswers, setAllAnswers] = useState<AnswerRecord[]>([]);
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [disableNext, setDisableNext] = useState(true);

  const hasFetched = useRef(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const router = useRouter();

  useNavigationBlocker(true);

  // -------- STEP 1: Check field + mic permissions --------
  useEffect(() => {
    const verifySetup = async () => {
      const userField = sessionStorage.getItem("userField");

      if (!userField) {
        toast.error("Please select your field before starting the interview.");
        router.push("/");
        return;
      }

      const hasMicAccess = await checkMicrophoneAccess();
      if (!hasMicAccess) {
        alert("🎙️ Microphone access is required. Please allow permission and try again.");
        router.push("/job-interview");
        return;
      }

      sessionStorage.setItem("allowSpeech", "true");
    };

    verifySetup();
  }, [router]);

  // -------- STEP 2: Fetch Job Interview Questions --------
  useEffect(() => {
    const fetchQuestions = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const userField = sessionStorage.getItem("userField");
      if (!userField) return router.push("/");

      try {
        const res =await fetch("/api/generate-questions/job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userField }),
        });

        const data = await res.json();
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          console.log("⚠️ Invalid question structure:", data);
        }
      } catch (error) {
        console.log("❌ Error loading questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [router]);

  // -------- STEP 3: Speak first question automatically --------
  useEffect(() => {
    const canSpeak = sessionStorage.getItem("allowSpeech");
    if (canSpeak && !isLoading && questions.length > 0) {
      const firstQuestion = questions[0];
      setTimeout(() => playQuestion(firstQuestion), 500);
      sessionStorage.removeItem("allowSpeech");
    }
    // eslint-disable-next-line
  }, [isLoading, questions]);

  // -------- Play Question --------
  const playQuestion = (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    setDisableNext(true);

    speakText(text, () => {
      setIsSpeaking(false);
      startListening();
      setDisableNext(false);
    });
  };

  // -------- Recording Controls --------
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

  // -------- Evaluate Answer --------
  const evaluateAnswer = async () => {
    stopListening();
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || !transcript) return;

    setDisableNext(true);
    try {
      const res = await fetch("/api/evaluate-answers/job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer: transcript,
        }),
      });

      const data: EvaluationJobResult = await res.json();
      setEvaluation(data);

      // Save record
      setAllAnswers((prev) => [
        ...prev,
        {
          question: currentQuestion,
          userAnswer: transcript,
          feedback: data.feedback,
          band9Answer: data.good_response,
          score: data.score, // ✅ Added score
        },
      ]);

      // Speak evaluation feedback
      const feedbackText = `Your score is ${data.score}. Feedback: ${data.feedback}. Here's a good response: ${data.good_response}`;
      speakText(feedbackText, () => {
        if (isLastQuestion()) {
          setShowDownloadBtn(true);
          setDisableNext(false);
        } else {
          setTimeout(() => nextQuestion(), 1000);
        }
      });
    } catch (err) {
      console.log("❌ Evaluation failed:", err);
      setDisableNext(false);
    }
  };

  // -------- Move to Next Question --------
  const nextQuestion = () => {
    setEvaluation(null);
    resetTranscript();

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      playQuestion(questions[nextIndex]);
    } else {
      alert("🎉 Interview Completed!");
      setShowDownloadBtn(true);
    }
  };

  const isLastQuestion = () => currentQuestionIndex === questions.length - 1;

  // -------- Loading UI --------
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-600 text-base md:text-lg animate-pulse">
          💼 Loading Job Interview Questions...
        </p>
      </div>
    );
  }

  // -------- Main UI --------
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        AI Job Interview Practice
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl text-center border border-gray-100">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>

        <p className="text-lg font-semibold text-gray-800 mb-6">
          {questions[currentQuestionIndex]}
        </p>

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
              transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
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
              Score: {evaluation.score ?? "N/A"}
            </h3>
            <p className="text-sm text-gray-800 mb-2">{evaluation.feedback}</p>
            <h4 className="font-semibold text-gray-700 mt-2">Good Response:</h4>
            <p className="text-sm text-gray-600">{evaluation.good_response}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={evaluateAnswer}
            disabled={!transcript || disableNext}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            🧠 Evaluate Answer
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={disableNext}
            variant="outline"
            className="border-gray-300"
          >
            ⏭ Next Question
          </Button>
        </div>

        {showDownloadBtn && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <DownloadFeedbackPDF allAnswers={allAnswers} title="Job Interview Feedback" fileName="job_interview_feedback.pdf" />
            <Link href="/">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                Go To Home
              </Button>
            </Link>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        Powered by <strong>SpeakSmart AI</strong>
      </p>
    </div>
  );
};

export default JobInterviewPage;
