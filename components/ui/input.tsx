import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { ChevronsUpDown } from "lucide-react"

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    const isNumber = type === "number"

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-2 text-[13px] text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow",
            isNumber && "pr-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            className
          )}
          {...props}
        />
        {isNumber && (
          <ChevronsUpDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
