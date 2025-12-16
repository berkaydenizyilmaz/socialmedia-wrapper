"use client";

import { cn } from "@/lib/utils";

export function StatCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  gradient = "from-pink-500 to-rose-500",
  className 
}) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6",
      "transition-all duration-300 hover:border-border hover:bg-card/80",
      className
    )}>
      {/* Background gradient glow */}
      <div className={cn(
        "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-20",
        `bg-linear-to-br ${gradient}`
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            `bg-linear-to-br ${gradient}`
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
