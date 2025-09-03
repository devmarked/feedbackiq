"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Highlighter } from "./highlighter";

interface WordRotateProps {
  words: string[];
  className?: string;
  duration?: number;
  highlightColor?: string;
}

export function WordRotate({ 
  words, 
  className, 
  duration = 2000, 
  highlightColor = "#f97316" 
}: WordRotateProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showHighlighter, setShowHighlighter] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out but keep highlighter visible longer
      setIsVisible(false);
      
      // After fade out completes, change word and fade in
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setKey(prevKey => prevKey + 1);
        setIsVisible(true);
        
        // Delay showing highlighter to allow word to fade in first
        setTimeout(() => {
          setShowHighlighter(true);
        }, 200); // Delay before highlight animation starts
      }, 300); // Duration for fade out
      
      // Hide highlighter slightly before the next transition to prevent flicker
      setTimeout(() => {
        setShowHighlighter(false);
      }, duration - 100); // Hide 100ms before next transition
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span 
      className={cn(
        "inline-block transition-opacity duration-300 ease-in-out",
        !isVisible && "opacity-0"
      )}
    >
      {showHighlighter ? (
        <Highlighter key={key} action="highlight" color={highlightColor}>
          <span className={cn("inline-block", className)}>
            {words[currentWordIndex]}
          </span>
        </Highlighter>
      ) : (
        <span className={cn("inline-block", className)}>
          {words[currentWordIndex]}
        </span>
      )}
    </span>
  );
}
