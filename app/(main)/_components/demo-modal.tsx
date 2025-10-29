import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DemoModal() {
  // const { isSupported, requestMic, startRecording, stopRecording, stopAll } = useMic();
  // const [recording, setRecording] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [aiResp, setAiResp] = useState(null);

  // async function handleStart() {
  //   try {
  //     await requestMic();
  //     startRecording();
  //     setRecording(true);
  //   } catch (err) {
  //     console.log("error: ", err);
  //     alert("Mic permission denied. Please allow microphone.");
  //   }
  // }

  // async function handleStop() {
  //   setLoading(true);
  //   const blob = await stopRecording();
  //   setRecording(false);

  //   const form = new FormData();
  //   form.append("audio", blob, "recording.webm");
  //   try {
  //     const res = await fetch("/api/ai/practice", {
  //       method: "POST",
  //       body: form,
  //     });
  //     const data = await res.json();
  //     setAiResp(data);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Upload failed");
  //   } finally {
  //     setLoading(false);
  //     stopAll();
  //   }
  // }

  // if (!isSupported)
  //   return <div>Your browser does not support microphone access.</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-lg">
      <h3 className="font-semibold">Try the Demo</h3>
      <p className="text-xs md:text-sm text-slate-600 mt-1">
        No signup — just talk and get instant demo feedback.
      </p>

      <div className="mt-4">
        <div>
          {/* {!recording ? ( */}
            <Link href='/speaking'>            
              <Button>
                Start Your Test
              </Button>
            </Link>
          {/* // ) : (
          //   <Button onClick={handleStop} variant='destructive' >
          //     Stop & Analyze
          //   </Button>
          // )}
          {loading && <span className="ml-3">Analyzing…</span>} */}
        </div>
      </div>

      {/* {aiResp && (
        <div className="mt-4 bg-slate-50 p-4 rounded-md">
          <div className="font-semibold">
            Predicted Band: {aiResp?.score ?? "—"}
          </div>
          <div className="text-sm mt-2">{aiResp?.transcript}</div>
        </div>
      )} */}
    </div>
  );
}
