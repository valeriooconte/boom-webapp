"use client"

import { useState } from "react"

import Convo from "@/components/convo"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { Clienti } from "@/components/clienti"
import { Report } from "@/components/report"

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState("home")

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
            <Convo />
          ) : activeItem === "documents" ? (
            <Report />
          ) : (
            <div className="text-gray-500">Work in porgress...</div>
          )}
        </main>
      </div>
    </div>
  )
}
