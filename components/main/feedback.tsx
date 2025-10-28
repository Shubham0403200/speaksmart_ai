import React from "react";

export default function FeedbackPreview() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl ">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-3">
        <div className="text-center md:text-start">
          <h5 className="font-semibold">Instant Feedback</h5>
          <p className="text-xs md:text-sm text-slate-600">
            Transcript, predicted band score & actionable tips.
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">7.0</div>
          <div className="text-xs text-slate-500">Predicted Band</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="font-bold">82%</div>
          <div className="text-xs text-slate-500">Fluency</div>
        </div>
        <div className="text-center">
          <div className="font-bold">78%</div>
          <div className="text-xs text-slate-500">Pronunciation</div>
        </div>
        <div className="text-center">
          <div className="font-bold">70%</div>
          <div className="text-xs text-slate-500">Grammar</div>
        </div>
        <div className="text-center">
          <div className="font-bold">80%</div>
          <div className="text-xs text-slate-500">Vocabulary</div>
        </div>
      </div>

      <div className="mt-4 text-xs md:text-sm text-slate-700">
        <strong>Tip:</strong> Try to slow your pace slightly and use varied
        linking words like “however” or “on the other hand”.
      </div>
    </div>
  );
}
