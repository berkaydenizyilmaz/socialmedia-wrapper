import Image from "next/image";
import { Instagram } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const variants = {
  instagram: {
    gradient: "from-purple-500 via-pink-500 to-orange-500",
    glow: "bg-pink-500/40",
    icon: <Instagram className="h-8 w-8 sm:h-10 sm:w-10 text-white" />,
  },
  twitter: {
    gradient: "from-neutral-200 to-neutral-400",
    glow: "bg-neutral-400/40",
    icon: <Image src="/twitter.png" alt="Twitter" width={40} height={40} className="h-8 w-8 sm:h-10 sm:w-10" />,
  },
};

export function PlatformCard({ title, description, buttonText, variant = "instagram", onClick }) {
  const style = variants[variant] || variants.instagram;

  return (
    <div className="group relative">
      {/* Static glow - only opacity animates */}
      <div className={`absolute -inset-1 ${style.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <Card className="relative border border-border/50 bg-card/80 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <CardHeader className="text-center pb-2 sm:pb-4 pt-6 sm:pt-8">
          {/* Icon with static gradient */}
          <div className={`mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} shadow-lg`}>
            {style.icon}
          </div>

          <CardTitle className="text-xl sm:text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground mt-2 text-sm sm:text-base">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 pb-6 sm:pb-8">
          <Button className="w-full" size="lg" onClick={onClick}>
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
