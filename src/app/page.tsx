"use client"

import { useState } from "react"

import Convo from "@/components/convo"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { Clienti } from "@/components/clienti"
import { Report } from "@/components/report"

export interface Company {
  id: string
  name: string
  report: string
}

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState("home")

  const [companies, setCompanies] = useState<Company[]>([
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
    {
      id: "3",
      name: "Elettromec",
      report:
        "Report dettagliato per VAR\n\nSituazione attuale:\n- Primo contatto stabilito\n- Richiesta preventivo in corso\n- Budget disponibile: medio-alto\n\nProssimi passi:\nProgrammare demo del prodotto.",
    },
  ])

  const setNewCompany = (newCompany: Omit<Company, "id">) => {
    setCompanies(prev => {
      // Se la lista non è vuota → ultimo id + 1, altrimenti 1
      const nextId =
        prev.length > 0 ? (parseInt(prev[prev.length - 1].id) + 1).toString() : "1"

      // Controlla se esiste un'azienda con lo stesso nome (per evitare duplicati)
      const existing = prev.find(c => c.name === newCompany.name)

      if (existing) {
        // 🔄 Aggiorna l'azienda esistente (match per nome)
        return prev.map(c =>
          c.name === newCompany.name ? { ...c, ...newCompany } : c
        )
      } else {
        // ➕ Aggiunge una nuova azienda con id incrementale
        return [...prev, { ...newCompany, id: nextId }]
      }
    })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} onItemChange={setActiveItem} />
      <div className="flex flex-1 flex-col">
        <Header activeSection={activeItem} />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          {activeItem === "home" ? (
            <Dashboard />
          ) : activeItem === "profile" ? (
            <Clienti />
          ) : activeItem === "users" ? (
            <Convo onSave={setNewCompany}/>
          ) : activeItem === "documents" ? (
            <Report companies={companies}/>
          ) : (
            <div className="text-gray-500">Work in porgress...</div>
          )}
        </main>
      </div>
    </div>
  )
}
