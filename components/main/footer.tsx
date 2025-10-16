'use client';
import { Logo } from "./logo";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();
  
  if (pathname.includes('/exam')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left Section */}
        <div>
          <Logo />
          <p className="text-xs md:text-sm text-gray-600 mt-2 leading-tight max-w-xl">
            AI-powered speaking practice — IELTS, Interviews & Conversations. <br />
            Free, no login required.
          </p>
        </div>

        {/* Right Section */}
        <div className="text-sm text-gray-600 text-left md:text-right">
          <p className="text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-800">SpeakSmart AI</span>
          </p>
          <div className="mt-1 space-x-2 text-gray-500">
            <a href="#" className="hover:text-gray-800 transition">Privacy</a>• {" "}
            <a href="#" className="hover:text-gray-800 transition">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}