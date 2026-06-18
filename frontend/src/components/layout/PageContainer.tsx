import React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div className="flex-1 bg-background text-text-primary py-12 md:py-16">
      <div 
        className={cn("container px-4 md:px-8 max-w-7xl mx-auto space-y-12", className)} 
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
