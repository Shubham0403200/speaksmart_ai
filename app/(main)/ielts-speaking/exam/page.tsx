// import React from 'react'

// const IELTSExamPage = () => {
//   return (
//     <div>
//         <h1>
//           IELTS Speaking Exam
//         </h1>
//         <div>
//             Questions <br />
//             Question 1: 
//         </div>
//         <div>

//         </div>
//         <div>
//           <h2>
//              Answer: 
//           </h2>
//         </div>
//     </div>
//   )
// }

// export default IELTSExamPage;

'use client';
import React from 'react'

const IELTSExamPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h1 className="text-4xl font-bold text-center mb-2">
            IELTS Speaking Exam
          </h1>
          <p className="text-center text-blue-100 text-lg">
            Practice your speaking skills with AI-powered feedback
          </p>
        </div>

        {/* Questions Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <h2 className="text-2xl font-semibold text-gray-800">Questions</h2>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <p className="text-lg font-medium text-gray-700 mb-2">
              Question 1:
            </p>
            <p className="text-gray-600">
              Describe a time when you had to use your imagination. You should say:
              <br />
              - What the situation was
              <br />
              - Why you needed to use imagination
              <br />
              - What you did
              <br />
              - And explain how you felt about it
            </p>
          </div>
        </div>

        {/* AI Speaking Animation */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <h2 className="text-2xl font-semibold text-gray-800">AI Response</h2>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-8 relative overflow-hidden">
            {/* Animated AI Avatar */}
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                {/* Pulsing animation */}
                <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping"></div>
              </div>
              <div className="ml-4">
                <h3 className="text-white font-semibold text-lg">IELTS Assistant</h3>
                <p className="text-cyan-300 text-sm">Speaking...</p>
              </div>
            </div>

            {/* Voice Visualization */}
            <div className="space-y-4">
              {/* Animated voice bars */}
              <div className="flex items-end justify-center space-x-1 h-12">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                  <div
                    key={bar}
                    className="w-2 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t-lg animate-pulse"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${bar * 0.1}s`,
                      animationDuration: `${0.5 + Math.random() * 0.5}s`
                    }}
                  ></div>
                ))}
              </div>

              {/* Simulated AI Speech */}
              <div className="text-center">
                <div className="inline-block bg-gray-800 rounded-lg px-6 py-4 max-w-2xl">
                  <p className="text-cyan-100 text-lg leading-relaxed">
                    That&apos;s an excellent question! Let me demonstrate how you might approach this answer...
                  </p>
                </div>
              </div>

              {/* Additional voice visualization */}
              <div className="flex items-end justify-center space-x-1 h-8 mt-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                  <div
                    key={bar}
                    className="w-1 bg-cyan-300 rounded-t-lg animate-bounce"
                    style={{
                      height: `${20 + Math.random() * 60}%`,
                      animationDelay: `${bar * 0.2}s`,
                      animationDuration: `${0.8 + Math.random() * 0.4}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Floating particles for background effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* User Answer Section */}
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <h2 className="text-2xl font-semibold text-gray-800">Your Answer</h2>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p className="text-lg">Click to start recording your answer</p>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Recording
            </button>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default IELTSExamPage