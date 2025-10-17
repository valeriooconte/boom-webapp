"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import Convo from "@/components/convo"

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState("home")

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} onItemChange={setActiveItem} />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          {activeItem === "users" ? <Convo /> : <div className="text-gray-500">Select an item from the sidebar</div>}
        </main>
      </div>
    </div>
  )
}
