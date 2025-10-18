"use client";
import { useState, useEffect } from "react";

export default function STT() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  //const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  /*
  useEffect(() => {
    // Compatibilità Chrome/Safari
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = "it-IT"; // o "en-US"
      setRecognition(recog);

      recog.onresult = (event: SpeechRecognitionEvent) => {
        const text = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(" ");
        setTranscript(text);
      };

      recog.onerror = e => console.error("Speech recognition error:", e);
    } else {
      console.warn("Web Speech API non supportata da questo browser.");
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };
  */

  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-semibold mb-2">🎙️ Speech Recognition</h2>
      <button
        //onClick={toggleListening}
        className={`px-4 py-2 rounded ${
          listening ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {listening ? "Stop" : "Start"}
      </button>
      <p className="mt-4 text-gray-700 italic">{transcript || "..."}</p>
    </div>
  );
}