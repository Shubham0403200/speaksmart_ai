export const speakText = (text: string, onEnd?: () => void) => {
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";   // Indian English accent
  utterance.rate = 1;         // Speed of speech
  utterance.pitch = 1;        // Voice pitch

  // Optional: pick a specific voice if available
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(v => v.lang === "en-IN") || voices[0];
  if (selectedVoice) utterance.voice = selectedVoice;

  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
};
