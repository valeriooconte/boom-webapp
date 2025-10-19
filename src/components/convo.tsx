"use client"
import { useState, useRef } from "react"
import ReactMarkdown from "react-markdown"

export default function Convo() {
  const [transcript, setTranscript] = useState("")
  const [lastSentTranscript, setLastSentTranscript] = useState("") // 👈 nuovo stato
  const [suggestions, setSuggestions] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false) // 👈 per gestire stato STT
  const recognitionRef = useRef<typeof SpeechRecognition | null>(null)

  // Modifiche Giovanni
  const [selectedWord, setSelectedWord] = useState("")
  const [showWordButton, setShowWordButton] = useState(false)

  const suggestion_prompt = `
  Agisci come un assistente cognitivo per consulenti aziendali durante colloqui con clienti.

  Leggi il seguente estratto della conversazione e:
  1. Identifica concetti, parole chiave o pattern rilevanti (es. problemi, bisogni, riferimenti a tool o competitor).
  2. Per ciascuno, genera una breve *risposta intelligente* o *spunto operativo*.
  3. Chiudi con un micro-riassunto se la conversazione è lunga.

  Conversazione:
  {chunk}

  Risposte intelligenti:
  `

  const username = "challengecrif"

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // ✅ SOLO le parti nuove della conversazione
  const handleSendToAI = async () => {
    setLoading(true)
    setSuggestions("")

    // prendi solo la parte nuova
    const newChunk = transcript.replace(lastSentTranscript, "").trim()
    if (!newChunk) {
      setSuggestions("Nessuna nuova parte da inviare.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("https://" + username + ".app.n8n.cloud/webhook-test/audio-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: suggestion_prompt,
          conversation: newChunk,
        }),
      })

      const data = await res.json()
      setSuggestions(data.message.content || "Nessuna risposta dall'AI")
      setLastSentTranscript(transcript) // 👈 aggiorna l’ultimo punto inviato
    } catch (err) {
      console.error(err)
      setSuggestions("Errore: impossibile contattare l'agente AI.")
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
    setSuggestions("")

    const wordQueryPrompt = `
    In base alla conversazione finora, fornisci informazioni (max 6 righe) su "${selectedWord}" nel contesto consulenziale:
    - Definizione
    - Applicazioni pratiche
    - Tool o tecnologie correlate
    - Suggerimenti operativi

    Conversazione di contesto:
    ${transcript}
    `

    try {
      const res = await fetch("https://" + username + ".app.n8n.cloud/webhook-test/audio-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: wordQueryPrompt,
          conversation: transcript,
        }),
      })

      const data = await res.json()
      setSuggestions(data.message.content || "Nessuna risposta dall'AI")
    } catch (err) {
      setSuggestions("Errore: impossibile contattare l'agente AI.")
    } finally {
      setLoading(false)
      setShowWordButton(false)
    }
  }

  // 🎙️ FUNZIONE: Speech-to-Text tramite Web Speech API
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
    <div className="grid grid-cols-2 gap-6 h-full">
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

          {/* 🎙️ Pulsante STT */}
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
        {loading ? (
          <p className="text-gray-500 text-sm">L'agente AI sta elaborando...</p>
        ) : (
          <div className="flex-1 p-4 bg-gray-50 rounded-md overflow-auto prose prose-sm max-w-none">
            <ReactMarkdown>{suggestions || "Nessun suggerimento ancora..."}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}