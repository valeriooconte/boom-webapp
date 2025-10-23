"use client"

import Image from "next/image"
import { Home, Users, AudioLines, FileText } from "lucide-react"

interface SidebarProps {
  activeItem: string
  onItemChange: (item: string) => void
}

// #0f1f3d
// #4F7DEE
// #5180ec

export function Sidebar({ activeItem, onItemChange }: SidebarProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "profile", icon: Users, label: "Profile" },
    { id: "users", icon: AudioLines, label: "Users" },
    { id: "documents", icon: FileText, label: "Documents" },
  ]

  return (
    <aside className="flex w-[120px] flex-col items-center bg-[#0f1f3d] py-8">
      {/* Navigazione */}
      <div className="flex flex-col items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={`flex h-16 w-16 items-center justify-center rounded-lg transition-colors ${
                isActive ? "bg-white text-[#0f1f3d]" : "text-white hover:bg-white/10"
              }`}
              aria-label={item.label}
            >
              <Icon className="h-7 w-7" />
            </button>
          )
        })}
      </div>

      {/* Spazio centrale per spingere il logo in basso */}
      <div className="flex-grow" />

      {/* Logo in basso */}
      <div className="mb-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={75}
          height={75}
          className="rounded-lg object-contain"
          priority
        />
      </div>
    </aside>
  )
}