"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "@/components/ui/button";
import { speakText } from "@/lib/tts-openai";
import { EvaluationResult, IELTSQuestions } from "@/components/interface";
import jsPDF from "jspdf";
import Link from "next/link";
import { checkMicrophoneAccess } from "@/lib/tts-openai";
import { useRouter } from "next/navigation";


interface AnswerRecord {
  question: string;
  userAnswer: string;
  feedback: string;
  band9Answer: string;
}

const IELTSExamPage = () => {
  const [questions, setQuestions] = useState<IELTSQuestions>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<"part1" | "part2" | "part3">("part1");
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [allAnswers, setAllAnswers] = useState<AnswerRecord[]>([]);
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [disableNext, setDisableNext] = useState(true);

  const hasFetched = useRef(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const router = useRouter();

// Run mic check before fetching questions
  useEffect(() => {
    const verifyPermissions = async () => {
      const hasMicAccess = await checkMicrophoneAccess();

      if (!hasMicAccess) {
        alert("🎙️ Microphone access is required to take the Speaking Test. Please allow mic permission and try again.");
        router.push("/ielts-speaking"); // send them back
        return;
      }

      // If mic access granted, mark that speech can start
      sessionStorage.setItem("allowSpeech", "true");
    };

    verifyPermissions();
  }, [router]);


  // -------- STEP 1: Fetch questions --------
  useEffect(() => {
    const fetchQuestions = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const res = await fetch("/api/generate-questions/ielts", { method: "POST" });
        const data = await res.json();
        if (data && (data.part1?.length || data.part2 || data.part3?.length)) {
          setQuestions(data);
        } else {
          console.error("⚠️ Invalid question structure:", data);
        }
      } catch (error) {
        console.error("❌ Error loading questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // -------- STEP 2: Speak first question automatically --------
  useEffect(() => {
  const canSpeak = sessionStorage.getItem("allowSpeech");

  if (canSpeak && !isLoading && questions?.part1 && questions?.part1?.length > 0) {
    const firstQuestion = questions?.part1[0];
    // Small timeout to ensure voices load
    setTimeout(() => playQuestion(firstQuestion), 500);
    sessionStorage.removeItem("allowSpeech");
  }
  // eslint-disable-next-line 
}, [isLoading, questions]);

  // -------- STEP 3: Convert question to audio + start listening --------
  const playQuestion = (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    setDisableNext(true);

    speakText(text, () => {
      setIsSpeaking(false);
      startListening();
      setDisableNext(false); // Enable next after question finishes
    });
  };

  // -------- Recording --------
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

  // -------- STEP 4: Evaluate answer --------
  const evaluateAnswer = async () => {
    stopListening();
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion || !transcript) return;

    setDisableNext(true); // Disable next while feedback audio is playing
    try {
      const res = await fetch("/api/evaluate-answers/ielts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer: transcript,
        }),
      });

      const data: EvaluationResult = await res.json();
      setEvaluation(data);

      // Save answer record
      setAllAnswers(prev => [
        ...prev,
        {
          question: currentQuestion,
          userAnswer: transcript,
          feedback: data.feedback,
          band9Answer: data.band9_answer,
        },
      ]);

      // Speak feedback + band 9 answer
      const evaluationText = `Your band score is ${data.band}. Feedback: ${data.feedback}. Band nine model answer: ${data.band9_answer}`;
      speakText(evaluationText, () => {
        // Enable next button after feedback + band9 audio finished
        setDisableNext(false);

        // If last question completed, show download button
        if (isLastQuestion()) setShowDownloadBtn(true);
      });
    } catch (err) {
      console.error("❌ Evaluation failed:", err);
      setDisableNext(false);
    }
  };

  // -------- STEP 5: Move to next question --------
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
      if (currentSection === "part1") setCurrentSection("part2");
      else if (currentSection === "part2") setCurrentSection("part3");
      else {
        alert("🎉 Test Completed!");
        setShowDownloadBtn(true);
      }
      setCurrentQuestionIndex(0);
    }
  };

  const getCurrentQuestion = () =>
    questions[currentSection]?.[currentQuestionIndex] || "";

  const isLastQuestion = () => {
    const sectionQuestions = questions[currentSection];
    if (!sectionQuestions) return false;
    return currentQuestionIndex === sectionQuestions.length - 1 &&
      currentSection === "part3"; // last section
  };

  // -------- PDF Download --------
  const downloadPDF = () => {
    if (!allAnswers.length) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageHeight = 297; // A4 page height in mm
    let y = 20; // start position
    const lineHeight = 7;

    // -------- Title --------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 100); // dark blue
    doc.text("IELTS Speaking Test Feedback", 105, y, { align: "center" });
    y += 12;

    allAnswers.forEach((ans, idx) => {
      const sectionTitle = `Question ${idx + 1}`;
      const questionText = `Q: ${ans.question}`;
      const userText = `Your Answer: ${ans.userAnswer}`;
      const feedbackText = `Feedback: ${ans.feedback}`;
      const band9Text = `Band 9 Answer: ${ans.band9Answer}`;

      // Check for page overflow
      if (y + 4 * lineHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      // Section Title Box
      doc.setFillColor(220, 230, 250); // light blue
      doc.rect(10, y - 5, 190, lineHeight + 2, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(sectionTitle, 15, y);
      y += lineHeight;

      // Question
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      const questionLines = doc.splitTextToSize(questionText, 180);
      doc.text(questionLines, 15, y);
      y += questionLines.length * lineHeight;

      // User Answer
      doc.setTextColor(80, 0, 0); // dark red
      const userLines = doc.splitTextToSize(userText, 180);
      doc.text(userLines, 15, y);
      y += userLines.length * lineHeight;

      // Feedback
      doc.setTextColor(0, 120, 0); // dark green
      const feedbackLines = doc.splitTextToSize(feedbackText, 180);
      doc.text(feedbackLines, 15, y);
      y += feedbackLines.length * lineHeight;

      // Band 9 Answer
      doc.setTextColor(0, 0, 120); // dark blue
      const band9Lines = doc.splitTextToSize(band9Text, 180);
      doc.text(band9Lines, 15, y);
      y += band9Lines.length * lineHeight + 5;
    });

    doc.save("IELTS_Feedback.pdf");
  };

  // -------- Loading UI --------
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-600 text-lg animate-pulse">
          🎙️ Loading IELTS Speaking Questions...
        </p>
      </div>
    );
  }

  // -------- Render UI --------
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">IELTS Speaking Test</h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl text-center border border-gray-100">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          {currentSection.toUpperCase()} — Question {currentQuestionIndex + 1}
        </h2>

        <p className="text-lg font-semibold text-gray-800 mb-6">{getCurrentQuestion()}</p>

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
            <h3 className="font-semibold text-green-700 mb-1">Band: {evaluation.band}</h3>
            <p className="text-sm text-gray-800 mb-2">{evaluation.feedback}</p>
            <h4 className="font-semibold text-gray-700 mt-2">Band 9 Model Answer:</h4>
            <p className="text-sm text-gray-600">{evaluation.band9_answer}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={evaluateAnswer} disabled={!transcript || disableNext} className="bg-blue-600 hover:bg-blue-700 text-white">
            🧠 Evaluate Answer
          </Button>
          <Button onClick={nextQuestion} disabled={disableNext} variant="outline" className="border-gray-300">
            ⏭ Next Question
          </Button>
        </div>

        {showDownloadBtn && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700 text-white">
              📄 Download Feedback PDF
            </Button>
            <Link href='/'>
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

export default IELTSExamPage;