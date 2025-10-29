"use client";
import React from "react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

interface AnswerRecord {
  question: string;
  userAnswer: string;
  feedback: string;
  band9Answer: string;
}

interface DownloadFeedbackPDFProps {
  allAnswers: AnswerRecord[];
  title: string;
  fileName: string;
}

export const DownloadFeedbackPDF: React.FC<DownloadFeedbackPDFProps> = ({
  allAnswers,
  title,
  fileName,
}) => {
  const generatePDF = () => {
    if (!allAnswers.length) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageHeight = 297;
    let y = 20;
    const lineHeight = 7;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 100);
    doc.text(title, 105, y, { align: "center" });
    y += 12;

    allAnswers.forEach((ans, idx) => {
      const sectionTitle = `Question ${idx + 1}`;
      const questionText = `Q: ${ans.question}`;
      const userText = `Your Answer: ${ans.userAnswer}`;
      const feedbackText = `Feedback: ${ans.feedback}`;
      const band9Text = `Band 9 Answer: ${ans.band9Answer}`;

      // Add page if near bottom
      if (y + 4 * lineHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      // Section title background
      doc.setFillColor(220, 230, 250);
      doc.rect(10, y - 5, 190, lineHeight + 2, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
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
      doc.setTextColor(80, 0, 0);
      const userLines = doc.splitTextToSize(userText, 180);
      doc.text(userLines, 15, y);
      y += userLines.length * lineHeight;

      // Feedback
      doc.setTextColor(0, 120, 0);
      const feedbackLines = doc.splitTextToSize(feedbackText, 180);
      doc.text(feedbackLines, 15, y);
      y += feedbackLines.length * lineHeight;

      // Band 9 Answer
      doc.setTextColor(0, 0, 120);
      const band9Lines = doc.splitTextToSize(band9Text, 180);
      doc.text(band9Lines, 15, y);
      y += band9Lines.length * lineHeight + 5;
    });

    doc.save(fileName);
  };

  return (
    <Button
      onClick={generatePDF}
      className="bg-green-600 hover:bg-green-700 text-white"
      disabled={!allAnswers.length}
    >
      📄 Download Feedback PDF
    </Button>
  );
};
