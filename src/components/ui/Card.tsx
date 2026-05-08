import { forwardRef, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "gradient";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const base = "rounded-2xl transition-all duration-300";

    const variants = {
      default:   "bg-[#0E1523] border border-white/[0.07]",
      elevated:  "bg-[#111827] border border-white/[0.07] shadow-lg shadow-black/30",
      gradient:  "bg-gradient-to-br from-[#0E1523] to-[#111827] border border-white/[0.07]",
    };

    return (
      <div ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
