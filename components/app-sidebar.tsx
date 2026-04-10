"use client"

import { useState } from "react"
import Image from "next/image"
import { FilePlus, ChevronLeft, ChevronRight, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isSurveysActive = pathname.startsWith("/surveys")
  const isInsightsActive = pathname.startsWith("/insights")

  return (
    <aside 
      className={cn(
        "sticky top-0 h-screen shrink-0 p-3 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[90px]" : "w-[300px]"
      )}
    >
      <div className="relative bg-border rounded-2xl py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full border border-muted-foreground/5">

        {/* LOGO & TOGGLE SECTION */}
        <div 
          className={cn(
            "h-[60px] mb-6 px-4 flex items-center transition-all duration-300",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {/* Logo - Only rendered when expanded */}
          {!isCollapsed && (
            <div 
              className="cursor-pointer animate-in fade-in duration-300"
              onClick={() => router.push("/surveys")}
            >
              <Image
                src="/logo.svg"
                alt="Amartha Design Lab"
                width={174}
                height={48}
                priority
                className="object-contain"
              />
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="border border-primary/10 rounded-sm p-1.5 hover:bg-secondary transition-colors z-20 flex items-center justify-center"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-4 items-center">
          <SidebarItem 
            icon={FilePlus} 
            label="CSAT Survey" 
            active={isSurveysActive}
            isCollapsed={isCollapsed}
            onClick={() => router.push("/surveys")}
          />
          <SidebarItem 
            icon={BarChart2} 
            label="User Insights" 
            active={isInsightsActive}
            isCollapsed={isCollapsed}
            onClick={() => router.push("/insights")}
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
  isCollapsed,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  isCollapsed: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : ""}
      className={cn(
        "flex items-center rounded-sm transition-all duration-200 text-left w-full cursor-pointer",
        isCollapsed ? "justify-center p-3 w-11" : "gap-3 px-4 py-3",
        active
          ? "bg-[#1A1A1A] text-white shadow-md"
          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && (
        <span className="text-[13px] font-semibold whitespace-nowrap opacity-100 transition-opacity duration-300">
          {label}
        </span>
      )}
    </button>
  )
}
