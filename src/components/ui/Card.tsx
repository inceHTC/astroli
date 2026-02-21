import { forwardRef, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "gradient";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const base = "rounded-2xl transition-all duration-300";

    const variants = {
      default:
        "bg-white border border-gray-200 shadow-sm",
      elevated:
        "bg-[#11121A] border border-[#1A1C2B] text-white",
      gradient:
        "bg-white border border-gray-200 shadow-sm",
    };

    return (
      <div
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
