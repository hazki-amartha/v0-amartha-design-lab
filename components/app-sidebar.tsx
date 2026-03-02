"use client"

import * as React from "react"
import Image from "next/image"
import { FilePlus } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  return (
    <aside className="flex flex-col p-3 w-[300px] shrink-0">
      <div className="bg-border rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] min-h-screen border border-muted-foreground/5">
        <div className="mb-6">
          <Image
            src="/logo.svg"
            alt="Amartha Design Lab"
            width={174}
            height={48}
            priority
          />
        </div>

        <nav className="flex flex-col gap-1">
          <SidebarItem icon={FilePlus} label="CSAT Survey Creator" active />
        </nav>
      </div>
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
        "flex items-center gap-3 rounded-md px-4 py-3 text-[14px] font-medium transition-colors text-left",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  )
}
