"use client";
import { useState } from "react";

import ReactMarkdown from "react-markdown";

export default function Page() {
  const [transcript, setTranscript] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

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
  `;

  const transcript_mock = `
  Consulente: Buongiorno, grazie per averci contattato. Ci parli un po’ della vostra esigenza.
  Cliente: Buongiorno, siamo un’azienda che si occupa di logistica e vogliamo digitalizzare la gestione dei magazzini. 
  Consulente: Ottimo. Al momento usate un software gestionale interno o Excel?
  Cliente: Per ora Excel, ma stiamo avendo problemi con gli errori di aggiornamento e la mancanza di visibilità in tempo reale.
  Consulente: Capisco. L’obiettivo principale quindi sarebbe migliorare il tracciamento e ridurre gli errori operativi?
  Cliente: Esatto, ma vogliamo anche avere report automatici sulle giacenze e sui tempi di consegna.
  Consulente: Perfetto. Potremmo proporre una soluzione basata su cloud, con dashboard integrate e accesso tramite tablet.
  Cliente: Interessante. Ci sono tempi o costi indicativi per un progetto del genere?
  Consulente: In media parliamo di 8-10 settimane di sviluppo. I costi dipendono dalle integrazioni con i vostri sistemi esistenti, ma possiamo partire da una fase di analisi.
  Cliente: Ottimo, ci piacerebbe ricevere una proposta dettagliata e magari un preventivo entro la prossima settimana.
  Consulente: Assolutamente. Vi invierò un documento con il piano di lavoro e le tempistiche entro venerdì.
  Cliente: Perfetto, grazie mille.
  Consulente: Grazie a voi, buona giornata.
  `;

  const username = "challengecrif"

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSendToAI = async () => {
    setLoading(true);
    setSuggestions("");

    setTranscript(transcript_mock);

    try {
      const res = await fetch("https://" + username + ".app.n8n.cloud/webhook-test/audio-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: suggestion_prompt,
          conversation: transcript_mock
        }),
      });

      //if (!res.ok) throw new Error("Errore durante la chiamata all'AI");

      const data = await res.json();
      //setSuggestions(data.suggestions || "Nessuna risposta dall'AI");
      setSuggestions(data.message.content || "Nessuna risposta dall'AI");
    } catch (err) {
      //console.error(err);
      setSuggestions("❌ Errore: impossibile contattare l'agente AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid grid-cols-2 gap-4 p-6 min-h-screen bg-gray-100">
      {/* Colonna sinistra */}
      <div className="flex flex-col border rounded-xl bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">🗣️ Conversazione in corso</h2>
        <textarea
          className="flex-1 border p-2 rounded resize-none"
          placeholder="Scrivi o incolla la conversazione..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSendToAI}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Salva parziale
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Termina
          </button>
          {saved && <span className="text-green-600 self-center">Salvato!</span>}
        </div>
      </div>

      {/* Colonna destra */}
      <div className="flex flex-col border rounded-xl bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">💡 Suggerimenti AI</h2>
        {loading ? (
          <p className="text-gray-500">⏳ L'agente AI sta elaborando...</p>
        ) : (
          <div className="flex-1 p-3 bg-gray-50 rounded overflow-auto prose prose-sm max-w-none">
            <ReactMarkdown>
              {suggestions || "Nessun suggerimento ancora..."}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </main>
  );
}

/*
          <pre className="flex-1 whitespace-pre-wrap p-3 bg-gray-50 rounded overflow-auto">
            {suggestions || "Nessun suggerimento ancora..."}
          </pre>
*/