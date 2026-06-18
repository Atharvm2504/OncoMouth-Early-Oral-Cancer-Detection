import React from "react"
import { LucideIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  tooltip?: string
  iconColor?: string
  bgColor?: string
}

export function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  tooltip,
  iconColor = "text-primary",
  bgColor = "bg-primary-light/50"
}: MetricCardProps) {
  const content = (
    <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl shadow-sm transition-all hover:shadow-[var(--shadow-hover)] hover:border-primary/20">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${bgColor} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-text-secondary">{label}</span>
      </div>
      <span className="text-sm font-bold text-text-primary">{value}</span>
    </div>
  )

  if (!tooltip) return content

  return (
    <Tooltip>
      <TooltipTrigger render={<div className="cursor-help" />}>
        {content}
      </TooltipTrigger>
      <TooltipContent>
        <p className="w-[200px] text-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
