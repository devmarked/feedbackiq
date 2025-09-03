"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedShinyTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 100,
}: AnimatedShinyTextProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <span className={className}>{children}</span>;
  }

  return (
    <p
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as React.CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-neutral-600/50 dark:text-neutral-400/50",

        // Shimmer effect
        "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shimmer gradient
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:from-transparent dark:via-white/80 dark:via-50% dark:to-transparent",

        // Hide text until shimmer loads
        "text-transparent",
        className,
      )}
    >
      {children}
    </p>
  );
}
