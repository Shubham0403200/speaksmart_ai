// export const speakText = (text: string, onEnd?: () => void) => {
//   if (!text) return;

//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = "en-IN";   // Indian English accent
//   utterance.rate = 1;         // Speed of speech
//   utterance.pitch = 1;        // Voice pitch

//   const voices = window.speechSynthesis.getVoices();
//   const selectedVoice = voices.find(v => v.lang === "en-IN") || voices[0];
//   if (selectedVoice) utterance.voice = selectedVoice;

//   if (onEnd) utterance.onend = onEnd;

//   window.speechSynthesis.speak(utterance);
// };


export const speakText = (text: string, onEnd?: () => void) => {
  if (!text) return;

  const synth = window.speechSynthesis;

  // Cancel ongoing speech if any
  if (synth.speaking) synth.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 1;
  utterance.pitch = 1;

  // Helper to actually speak
  const speak = () => {
    const voices = synth.getVoices();
    const selected = voices.find((v) => v.lang === "en-IN") || voices[0];
    if (selected) utterance.voice = selected;

    if (onEnd) utterance.onend = onEnd;

    // Kickstart speech
    synth.speak(utterance);
  };

  // Wait for voices if not loaded yet
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = speak;
  } else {
    speak();
  }
};

// utils/checkMicrophoneAccess.ts
export async function checkMicrophoneAccess(): Promise<boolean> {
  try {
    // Request access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Immediately stop tracks to free mic
    stream.getTracks().forEach(track => track.stop());

    console.log("✅ Microphone permission granted");
    return true;
  } catch (err) {
    console.warn("❌ Microphone access denied:", err);
    return false;
  }
}
