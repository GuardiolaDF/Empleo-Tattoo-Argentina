import React from "react";

interface SpecialtyPillProps {
  label: string;
  variant?: "default" | "outline";
}

export function SpecialtyPill({ label, variant = "default" }: SpecialtyPillProps) {
  const baseClasses = "font-sans text-xs tracking-widest uppercase px-3 py-1.5 inline-flex items-center justify-center";
  const variantClasses = variant === "outline" 
    ? "bg-transparent text-black border border-black" 
    : "bg-black text-white";

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {label}
    </span>
  );
}
