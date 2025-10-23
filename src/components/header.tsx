import Image from "next/image"
import { Settings, Bell } from "lucide-react"

interface HeaderProps {
  activeSection: string
}

const sectionNames: Record<string, string> = {
  home: "Dashboard",
  profile: "Clienti",
  users: "Incontro",
  documents: "Report",
}

export function Header({ activeSection }: HeaderProps) {
  return (
    <header className="flex h-[120px] items-center justify-between bg-white px-8 shadow-sm">
      {/* Logo + Titolo */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-[#0f1f3d]">
          {sectionNames[activeSection] || "Dashboard"}
        </h1>
      </div>

      {/* Icone a destra */}
      <div className="flex items-center gap-6">
        <button
          className="relative flex h-12 w-12 items-center justify-center rounded-full text-[#0f1f3d] transition-colors hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            2
          </span>
        </button>

        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0f1f3d] text-white transition-opacity hover:opacity-90"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </header>
  )
}