// src/hooks/useMic.ts
import { useEffect, useRef, useState } from "react";

export function useMic() {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [permission, setPermission] = useState<"idle"|"granted"|"denied">("idle");
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
    }
  }, []);

  async function requestMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setPermission("granted");
      return stream;
    } catch (err) {
      setPermission("denied");
      throw err;
    }
  }

  function startRecording(options?: MediaRecorderOptions) {
    if (!mediaStreamRef.current) throw new Error("Mic not initialized — call requestMic()");
    audioChunksRef.current = [];
    const recorder = new MediaRecorder(mediaStreamRef.current, options);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
    recorder.start();
    return recorder;
  }

  async function stopRecording(): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return reject(new Error("No recording in progress"));

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        resolve(blob);
      };
      recorder.stop();
    });
  }

  function stopAll() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    mediaRecorderRef.current = null;
    setPermission("idle");
  }

  return {
    isSupported,
    permission,
    requestMic,
    startRecording,
    stopRecording,
    stopAll
  } as const;
}
