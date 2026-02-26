"use client"

import { FileCode2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  return (
    <aside className="flex flex-col gap-8 p-6 w-[220px] shrink-0">
      <div>
        <h1 className="text-[17px] font-bold leading-tight tracking-tight text-foreground">
          Amartha<br />Design Lab
        </h1>
      </div>

      <nav className="flex flex-col gap-1">
        <SidebarItem icon={FileCode2} label="Survey Creator" active />
      </nav>
    </aside>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors text-left",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  )
}
