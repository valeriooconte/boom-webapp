"use client"

import { useState } from "react"
import { Search, FolderSearch, UserCircle, Check, X, Minus } from "lucide-react"

interface Client {
  id: string
  company: string
  name: string
  status: "active" | "inactive" | "pending"
}

export function Clienti() {
  const [searchQuery, setSearchQuery] = useState("")
  const [clients] = useState<Client[]>([
    {
      id: "1",
      company: "Elettromec",
      name: "Mario Rossi",
      status: "active",
    },
    {
      id: "2",
      company: "VAR",
      name: "Viola Santi",
      status: "inactive",
    },
    {
      id: "3",
      company: "Azienda",
      name: "Nome Cliente",
      status: "pending",
    },
  ])

  const filteredClients = clients.filter(
    (client) =>
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusIcon = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
            <Check className="h-6 w-6 text-white" />
          </div>
        )
      case "inactive":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
            <X className="h-6 w-6 text-white" />
          </div>
        )
      case "pending":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400">
            <Minus className="h-6 w-6 text-white" />
          </div>
        )
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Ricerca + Pulsante "Nuovo Cliente" */}
      <div className="mb-8 flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca cliente o azienda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border-2 border-gray-900 py-3 pl-14 pr-4 text-base focus:outline-none"
          />
        </div>
        <button className="whitespace-nowrap rounded-full bg-[#0f1f3d] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#1a2f5a] cursor-pointer">
          Nuovo Cliente
        </button>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[1fr_80px_80px] items-center mb-4 px-6 text-gray-400">
        <div></div> {/* colonna sinistra vuota per allineamento */}
            <div className="flex justify-center">
                <h2 className="text-lg font-semibold">Stato</h2>
            </div>
        <div></div> {/* colonna destra vuota per l’icona folder */}
      </div>

      {/* Lista Clienti */}
      <div className="space-y-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="grid grid-cols-[1fr_80px_80px] items-center rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Avatar e Info Clienti */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0f1f3d]">
                <UserCircle className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f1f3d]">{client.company}</h3>
                <p className="text-base font-semibold text-[#0f1f3d]">{client.name}</p>
              </div>
            </div>

            {/* Icona di Stato */}
            <div className="flex justify-center">
              {getStatusIcon(client.status)}
            </div>

            {/* Icona Documenti Cliente */}
            <button className="flex justify-center transition-transform hover:scale-110">
              <FolderSearch className="h-12 w-12 text-[#0f1f3d]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
