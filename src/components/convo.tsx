"use client"
import { useState } from "react"

import ReactMarkdown from "react-markdown"

export default function Convo() {
  const [transcript, setTranscript] = useState("")
  const [suggestions, setSuggestions] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  // Modifiche Giovanni
  const [selectedWord, setSelectedWord] = useState("")
  const [showWordButton, setShowWordButton] = useState(false)

  // TBD: aggiungi info extraction
  const suggestion_prompt = `
  Agisci come un assistente cognitivo per consulenti aziendali durante colloqui con clienti.

  Leggi il seguente estratto della conversazione e:
  1. Identifica i concetti, parole chiave o pattern rilevanti (es. problemi, bisogni, riferimenti a tool o competitor).
  2. Per ciascuno, genera una breve *risposta intelligente* o *spunto operativo*.
    - Se viene nominato un tool o un competitor → confrontalo brevemente con alternative o suggerisci insight utili.
    - Se emerge un bisogno o problema → proponi soluzioni pratiche.
    - Se emergono idee vaghe → trasformale in azioni concrete o nuove direzioni.
    - Se la conversazione è lunga → chiudi con un micro-riassunto.

  Rispondi in linguaggio naturale, come un collega che interviene con consigli concreti.

  Conversazione:
  {chunk}

  Risposte intelligenti:
  `

  const transcript_mock = `
  Consulente: Buongiorno, grazie per averci contattato. Ci parli un po' della vostra esigenza.
  Cliente: Buongiorno, siamo un'azienda che si occupa di logistica e vogliamo digitalizzare la gestione dei magazzini. 
  Consulente: Ottimo. Al momento usate un software gestionale interno o Excel?
  Cliente: Per ora Excel, ma stiamo avendo problemi con gli errori di aggiornamento e la mancanza di visibilità in tempo reale.
  Consulente: Capisco. L'obiettivo principale quindi sarebbe migliorare il tracciamento e ridurre gli errori operativi?
  Cliente: Esatto, ma vogliamo anche avere report automatici sulle giacenze e sui tempi di consegna.
  Consulente: Perfetto. Potremmo proporre una soluzione basata su cloud, con dashboard integrate e accesso tramite tablet.
  Cliente: Interessante. Ci sono tempi o costi indicativi per un progetto del genere?
  Consulente: In media parliamo di 8-10 settimane di sviluppo. I costi dipendono dalle integrazioni con i vostri sistemi esistenti, ma possiamo partire da una fase di analisi.
  Cliente: Ottimo, ci piacerebbe ricevere una proposta dettagliata e magari un preventivo entro la prossima settimana.
  Consulente: Assolutamente. Vi invierò un documento con il piano di lavoro e le tempistiche entro venerdì.
  Cliente: Perfetto, grazie mille.
  Consulente: Grazie a voi, buona giornata.
  `

  const username = "challengecrif"

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSendToAI = async () => {
    setLoading(true)
    setSuggestions("")

    setTranscript(transcript_mock)

    try {
      const res = await fetch("https://" + username + ".app.n8n.cloud/webhook-test/audio-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: suggestion_prompt,
          conversation: transcript_mock,
        }),
      })

      const data = await res.json()
      setSuggestions(data.message.content || "Nessuna risposta dall'AI")
    } catch (err) {
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

  // Funzione modificata Giovanni
  const handleQueryWord = async () => {
    if (!selectedWord) return
    
    setLoading(true)
    setSuggestions("")

    const wordQueryPrompt = `
    In base alla conversazione avvenuta fino ad ora, fornisci informazioni dettagliate e riassuntive (in massimo 6 righe) sulla seguente parola/concetto nel contesto di consulenza aziendale: "${selectedWord}"
    
    Includi:
    - Definizione e significato
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

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Colonna sinistra */}
      <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#0f1f3d]">Conversazione in corso</h2>
        {/* textarea modificata Giovanni */}
        <textarea
          className="flex-1 border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#0f1f3d] focus:border-transparent text-sm"
          placeholder="Scrivi o incolla la conversazione..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onMouseUp={handleWordSelection}
          onKeyUp={handleWordSelection}
        />
        {/* Modifiche Giovanni */}
        <div className="mt-4 flex gap-3 flex-wrap items-center">
          {showWordButton && (
            <button
              onClick={handleQueryWord}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Interroga AI su "{selectedWord}"
            </button>
          )}
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

      {/* Colonna destra */}
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
