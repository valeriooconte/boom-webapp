"use client"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { ChevronRight } from "lucide-react"

import { Company } from "@/app/page"

export default function Convo({ onSave }: { onSave: (c: Omit<Company, "id">) => void }) {
  const [transcript, setTranscript] = useState("")
  const [lastSentTranscript, setLastSentTranscript] = useState("")
  const [selectedWord, setSelectedWord] = useState("")
  const [companyName, setCompanyName] = useState("")

  const [showWordButton, setShowWordButton] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const [suggestions, setSuggestions] = useState<Array<{timestamp: string, content: string, type: string}>>([])

  const recognitionRef = useRef<any>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Banner di errore
  const [showError, setShowError] = useState(false)

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
  const AGENT_URL = "https://hermia.app.n8n.cloud/webhook"

  const handleSave = async () => {

    try {
      const res = await fetch(AGENT_URL + "/report-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: transcript,
          suggestions: suggestions.map(s => `Suggerimento ricevuto alle ${s.timestamp}:\n${s.content}`),
        }),
      })

      if (!res.ok) throw new Error("Errore nella richiesta")

      const data = await res.json()

      onSave({
        name: companyName,
        report: data.output.content[0].text,//data.message.content,
      })

      

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      // Ci serve?
      console.log("Terminato")
    }
  }

  const handleSendToAI = async () => {
    setLoading(true)
    const newChunk = transcript.replace(lastSentTranscript, "").trim()
    if (!newChunk) {
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

      if (!res.ok) throw new Error("Errore nella richiesta")

      const data = await res.json()

      setSuggestions((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          content: data.output.content[0].text || "Nessuna risposta dall'AI",
          type: "partial",
        },
      ])
      setExpandedIndex(suggestions.length) // espandi l'ultimo
      setLastSentTranscript(transcript)
    } catch (err) {
      console.error(err)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleWordSelection = () => {
    const selection = window.getSelection()
    const word = selection?.toString().trim()
    //if (word && word.split(/\s+/).length === 1) {
    if (word) {  
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

      if (!res.ok) throw new Error("Errore nella richiesta parola")

      const data = await res.json()
      setSuggestions((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          content: data.output.content[0].text || "Nessuna risposta dall'AI",
          type: "word",
        },
      ])
      setExpandedIndex(suggestions.length)
    } catch {
      console.error("Errore nella query parola")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setLoading(false)
      setShowWordButton(false)
    }
  }

  // Scroll automatico verso l’ultimo suggerimento
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [suggestions])

  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("API SpeechRecognition non supportata.")
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
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const piece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + " " + piece.trim())
        }
      }
    }

    recognition.onend = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  return (
    <div className="relative grid grid-cols-2 gap-6 h-screen p-6 bg-gray-100 overflow-hidden">
      {/* Banner di errore */}
      {showError && (
        <div className="absolute top left-1/2 -translate-x-1/2 bg-red-50 text-red-700 px-6 py-2 rounded-md shadow-md transition-opacity duration-500">
          Errore: impossibile contattare l'agente AI, riprova.
        </div>
      )}

      {/* SINISTRA */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-[#0f1f3d]">
            Conversazione con:
          </h2>

          <input
            type="text"
            className="border border-gray-300 rounded-lg px-2 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#0f1f3d] min-w-[220px]"
            placeholder="Nome azienda"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-3 mb-4 flex-wrap items-center">
          <button
            onClick={toggleRecording}
            className={`px-5 py-2.5 rounded-md text-sm text-white ${
              isRecording ? "bg-orange-500" : "bg-blue-600"
            } cursor-pointer`}
          >
            {isRecording ? "Pausa" : "Registra"}
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-red-600 text-white rounded-md text-sm cursor-pointer"
          >
            Termina
          </button>

          <button
            onClick={handleSendToAI}
            className="px-5 py-2.5 bg-green-600 text-white rounded-md text-sm cursor-pointer"
          >
            Suggerimento
          </button>

          {showWordButton && (
            <button
              onClick={handleQueryWord}
              className="px-5 py-2.5 bg-yellow-500 text-white rounded-md text-sm cursor-pointer"
            >
              Interroga AI su "{selectedWord}"
            </button>
          )}

          {saved && <span className="text-emerald-600 text-sm font-medium">Salvato!</span>}
        </div>

        <textarea
          className="flex-1 border border-gray-300 p-3 rounded-md resize-none focus:ring-2 focus:ring-[#0f1f3d] text-sm"
          placeholder="Scrivi o registra la conversazione..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onMouseUp={handleWordSelection}
          onKeyUp={handleWordSelection}
        />
      </div>

      {/* DESTRA */}
      <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm border border-gray-200 overflow-y-auto h-full">
        <h2 className="text-lg font-semibold mb-4 text-[#0f1f3d]">Suggerimenti AI</h2>

        {loading && <p className="text-gray-500 text-sm mb-2">Elaborazione...</p>}

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto space-y-3 pr-2"
        >
          {suggestions.length === 0 ? (
            <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded-md">
              Nessun suggerimento ancora...
            </p>
          ) : (
            suggestions.map((item, index) => (
              <div
                key={index}
                className={`p-4 bg-gray-50 rounded-md border-l-4 transition-all cursor-pointer ${
                  expandedIndex === index
                    ? "border-[#0f1f3d]"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.type === "word"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {item.type === "word" ? "Ricerca parola" : "Suggerimento"}
                    </span>
                  </div>

                  {/* Indicatore di espansione con ChevronRight */}
                  <div
                    className={`flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-500 transition-transform ${
                      expandedIndex === index ? "rotate-90 bg-gray-200 text-[#0f1f3d]" : ""
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {expandedIndex === index && (
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{item.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}