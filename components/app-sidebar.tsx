"use client"

import * as React from "react"
import Image from "next/image"
import { FileCode2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  return (
    <aside className="flex flex-col gap-6 p-6 w-[300px] shrink-0">
      <div>
        <Image
          src="/logo.svg"
          alt="Amartha Design Lab"
          width={174}
          height={48}
          priority
        />
      </div>

      <nav className="flex flex-col gap-1">
        <SidebarItem icon={ClipboardPlus} label="CSAT Survey Creator" active />
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
        "flex items-center gap-3 rounded-2 px-4 py-2.5 text-[15px] font-medium transition-colors text-left",
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
