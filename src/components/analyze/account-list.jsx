"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AccountList({ 
  title, 
  accounts = [], 
  maxVisible = 10,
  showCount = true,
  emptyMessage = "Hesap bulunamadı",
  className 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const visibleAccounts = isExpanded ? accounts : accounts.slice(0, maxVisible);
  const hasMore = accounts.length > maxVisible;

  const handleAccountClick = (username) => {
    window.open(`https://instagram.com/${username}`, '_blank');
  };

  if (accounts.length === 0) {
    return (
      <div className={cn(
        "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6",
        className
      )}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {accounts.length} hesap
        </span>
      </div>
      
      <div className="space-y-2">
        {visibleAccounts.map((account, index) => (
          <div
            key={account.username}
            onClick={() => handleAccountClick(account.username)}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl cursor-pointer",
              "bg-muted/30 hover:bg-muted/50 transition-colors"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {index + 1}
              </span>
              <span className="font-medium">@{account.username}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {showCount && account.count && (
                <span className="text-sm text-muted-foreground">
                  {account.count}
                </span>
              )}
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Daha az göster
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              {accounts.length - maxVisible} hesap daha göster
            </>
          )}
        </Button>
      )}
    </div>
  );
}
