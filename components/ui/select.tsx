import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { ChevronDown } from "lucide-react"

const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-2.5 pr-9 text-[13px] text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow appearance-none",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
