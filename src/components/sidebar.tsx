"use client"

import { Home, User, AudioLines, FileText } from "lucide-react"

interface SidebarProps {
  activeItem: string
  onItemChange: (item: string) => void
}

export function Sidebar({ activeItem, onItemChange }: SidebarProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "users", icon: AudioLines, label: "Users" },
    { id: "documents", icon: FileText, label: "Documents" },
  ]

  return (
    <aside className="flex w-[120px] flex-col items-center gap-6 bg-[#0f1f3d] py-8">
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
    </aside>
  )
}
