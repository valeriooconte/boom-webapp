"use client"
import { useState, useRef } from "react"
import ReactMarkdown from "react-markdown"

export default function Convo() {
  const [transcript, setTranscript] = useState("")
  const [lastSentTranscript, setLastSentTranscript] = useState("")
  const [suggestions, setSuggestions] = useState<Array<{timestamp: string, content: string, type: string}>>([])
  const [selectedWord, setSelectedWord] = useState("")

  const [showWordButton, setShowWordButton] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const recognitionRef = useRef<any>(null)

  const suggestionPrompt = `
  Agisci come un assistente cognitivo per consulenti aziendali durante colloqui con clienti.

  Leggi il seguente estratto della conversazione e:
  1. Identifica concetti, parole chiave o pattern rilevanti (es. problemi, bisogni, riferimenti a tool o competitor).
  2. Per ciascuno, genera una breve *risposta intelligente* o *spunto operativo*.
  3. Chiudi con un micro-riassunto se la conversazione è lunga.

  Estratto di conversazione da leggere e analizzare:
  `

  const wordQueryPrompt = `
  In base alla conversazione finora, fornisci informazioni (max 6 righe) su "${selectedWord}" nel contesto consulenziale:
  - Definizione
  - Applicazioni pratiche
  - Tool o tecnologie correlate
  - Suggerimenti operativi

  Conversazione di contesto:
  `

  // NB: sostituire quando l'agente verrà attivato
  const AGENT_URL = "https://challengecrif.app.n8n.cloud/webhook-test"

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSendToAI = async () => {
    setLoading(true)

    // Considera solo la parte nuova
    const newChunk = transcript.replace(lastSentTranscript, "").trim()
    if (!newChunk) {
      setSuggestions(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        content: "Nessuna nuova parte da inviare.",
        type: "partial"
      }])
      setLoading(false)
      return
    }

    try {
      const res = await fetch(AGENT_URL + "/audio-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: suggestionPrompt,
          conversation: newChunk,
        }),
      })

      const data = await res.json()
      setSuggestions(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        content: data.message.content || "Nessuna risposta dall'AI",
        type: "partial"
      }])
      setLastSentTranscript(transcript)
    } catch (err) {
      console.error(err)
      setSuggestions(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        content: "Errore: impossibile contattare l'agente AI.",
        type: "partial"
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleWordSelection = () => {
    const selection = window.getSelection()
    const word = selection?.toString().trim()
    if (word && word.split(/\s+/).length === 1) {
      setSelectedWord(word)
      setShowWordButton(true)
    } else {
      setShowWordButton(false)
    }
  }

  const handleQueryWord = async () => {
    if (!selectedWord) return

    setLoading(true)

    try {
      const res = await fetch(AGENT_URL + "/audio-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: wordQueryPrompt,
          conversation: transcript,
        }),
      })

      const data = await res.json()
      setSuggestions(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        content: data.message.content || "Nessuna risposta dall'AI",
        type: "word"
      }])
    } catch (err) {
      setSuggestions(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        content: "Errore: impossibile contattare l'agente AI.",
        type: "word"
      }])
    } finally {
      setLoading(false)
      setShowWordButton(false)
    }
  }

  // Speech-to-Text tramite Web Speech API
  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("API SpeechRecognition non supportata su questo browser.")
      return
    }

    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = "it-IT"
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: any) => {
      let interimTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPiece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + " " + transcriptPiece.trim())
        } else {
          interimTranscript += transcriptPiece
        }
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Errore riconoscimento:", event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-screen p-6 bg-gray-100">
      {/* COLONNA SINISTRA */}
      <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#0f1f3d]">Conversazione in corso</h2>

        <textarea
          className="flex-1 border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#0f1f3d] focus:border-transparent text-sm"
          placeholder="Scrivi o registra la conversazione..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onMouseUp={handleWordSelection}
          onKeyUp={handleWordSelection}
        />

        <div className="mt-4 flex gap-3 flex-wrap items-center">
          {showWordButton && (
            <button
              onClick={handleQueryWord}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Interroga AI su "{selectedWord}"
            </button>
          )}

          {/* Pulsante Speech-to-Text */}
          <button
            onClick={toggleRecording}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
              isRecording
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isRecording ? "🛑 Ferma trascrizione" : "🎙️ Avvia trascrizione"}
          </button>

          <button
            onClick={handleSendToAI}
            className="px-5 py-2.5 bg-[#0f1f3d] text-white rounded-md hover:bg-[#1a2f52] transition-colors text-sm font-medium"
          >
            Salva parziale
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            Termina
          </button>

          {saved && <span className="text-emerald-600 self-center text-sm font-medium">Salvato!</span>}
        </div>
      </div>

      {/* COLONNA DESTRA */}
      <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#0f1f3d]">Suggerimenti AI</h2>
        {loading && (
          <p className="text-gray-500 text-sm mb-2">L'agente AI sta elaborando...</p>
        )}
        <div className="flex-1 overflow-auto space-y-4">
          {suggestions.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-500 text-sm">Nessun suggerimento ancora...</p>
            </div>
          ) : (
            suggestions.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-[#0f1f3d]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500">{item.timestamp}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.type === 'word' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {item.type === 'word' ? 'Ricerca parola' : 'Suggerimento'}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
