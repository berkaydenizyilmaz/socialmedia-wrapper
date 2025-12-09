"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { ArrowRight, Check } from "lucide-react";

export function ProviderCard({ provider, onSelect }) {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg"
          onClick={() => onSelect(provider.slug)}>
      {/* Subtle gradient background */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${provider.accent}`}
      />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              {provider.icon}
            </div>
            <div>
              <CardTitle className="text-xl">{provider.name}</CardTitle>
              <CardDescription className="mt-0.5">Analiz hazır</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-zinc-400">
          {provider.summary}
        </p>

        <div className="space-y-2">
          {provider.highlights?.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-zinc-300">
              <Check className="h-3.5 w-3.5 text-blue-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <Badge variant="success" className="gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Güvenli
        </Badge>
        
        <Button 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(provider.slug);
          }}
          className="group/btn"
        >
          Başlat
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
