"use client"

import { useState } from "react"
import { X, Send, FileText } from "lucide-react"
import { emailTemplate } from "../utils/emailTemplate";

interface Company {
  id: string
  name: string
  report: string
}

export function Report() {
  const [companies] = useState<Company[]>([
    {
      id: "1",
      name: "CRIF",
      report:
        "Report dettagliato per CRIF\n\nPunti chiave:\n- Incontro produttivo del 15/10/2025\n- Interesse per i nostri servizi\n- Follow-up previsto per novembre\n\nNote aggiuntive:\nIl cliente ha mostrato particolare interesse per le soluzioni enterprise.",
    },
    {
      id: "2",
      name: "VAR",
      report:
        "Report dettagliato per VAR\n\nSituazione attuale:\n- Primo contatto stabilito\n- Richiesta preventivo in corso\n- Budget disponibile: medio-alto\n\nProssimi passi:\nProgrammare demo del prodotto.",
    },
  ])

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [editedReport, setEditedReport] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [companyName, setCompanyName] = useState("")

  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")

  async function handleSendEmail() {
    setStatus("sending")

    try {
      // Converte la stringa report in base64 per allegarla
      const docxBase64 = btoa(encodeURIComponent(editedReport))

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailAddress,
          subject: "Report Generato",
          htmlContent: emailTemplate(companyName),
          docxContentBase64: docxBase64,
        }),
      })

      if (res.ok) setStatus("done")
      else setStatus("error")
    } catch (err) {
      console.error(err)
      setStatus("error")
    }
  }

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company)
    setEditedReport(company.report)
    setEmailAddress("")
    setCompanyName(company.name)
  }

  const handleClose = () => {
    setSelectedCompany(null)
    setEditedReport("")
    setEmailAddress("")
  }


  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="text-gray-600">Seleziona un'azienda per visualizzare e modificare il report</p>
      </div>

      {/* Company List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <button
            key={company.id}
            onClick={() => handleCompanyClick(company)}
            className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f1f3d]">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-[#0f1f3d]">{company.name}</h3>
              {/* <p className="text-sm text-gray-500">Visualizza report</p> */}
            </div>
          </button>
        ))}
      </div>

      {/* Overlay Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
              <h2 className="text-2xl font-bold text-[#0f1f3d]">{selectedCompany.name}</h2>
              <button onClick={handleClose} className="rounded-full p-2 transition-colors hover:bg-gray-100">
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Report Content */}
            <div className="p-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Report</label>
                <textarea
                  value={editedReport}
                  onChange={(e) => setEditedReport(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 p-4 text-gray-800 focus:border-[#0f1f3d] focus:outline-none min-h-[300px] font-mono text-sm"
                  placeholder="Scrivi il report qui..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Indirizzo Email</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 p-4 text-gray-800 focus:border-[#0f1f3d] focus:outline-none"
                  placeholder="esempio@email.com"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendEmail}
                disabled={!emailAddress || !editedReport || status === "sending"}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0f1f3d] px-6 py-4 font-semibold text-white transition-colors hover:bg-[#1a2f5a] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                {status === "sending" ? "Invio in corso..." : "Invia Report via Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
