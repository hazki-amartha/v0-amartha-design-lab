"use client"

import * as React from "react"
import Image from "next/image"
import { FilePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  // Helper to determine if a link is active
  const isSurveysActive = pathname.startsWith("/surveys")

  return (
    /* h-screen and sticky keep it from moving when the middle content scrolls */
    <aside className="sticky top-0 h-screen w-[300px] shrink-0 p-3 flex flex-col">
      {/* Removed min-h-screen from here and used h-full. 
         This ensures the background color/border spans the window height perfectly.
      */}
      <div className="bg-border rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full border border-muted-foreground/5 overflow-y-auto">
        <div 
          className="mb-6 cursor-pointer" 
          onClick={() => router.push("/surveys")}
        >
          <Image
            src="/logo.svg"
            alt="Amartha Design Lab"
            width={174}
            height={48}
            priority
          />
        </div>

        <nav className="flex flex-col gap-1">
          <SidebarItem 
            icon={FilePlus} 
            label="CSAT Survey" 
            active={isSurveysActive}
            onClick={() => router.push("/surveys")}
          />
        </nav>
      </div>
    </aside>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all text-left",
        active
          ? "bg-[#1A1A1A] text-white shadow-md" // Matching your screenshot's dark active state
          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  )
}