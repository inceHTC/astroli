import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", fullWidth, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#D4AF72] to-[#C9A96E] text-[#070B12] shadow-lg shadow-[#D4AF72]/20 hover:shadow-[#D4AF72]/35 hover:scale-[1.02]",
      secondary:
        "bg-white/[0.06] border border-white/[0.12] text-[#EDE9DF] hover:bg-white/[0.10]",
      ghost:
        "bg-transparent text-[#EDE9DF] hover:bg-white/[0.06]",
      outline:
        "border border-[#D4AF72]/40 text-[#D4AF72] hover:bg-[#D4AF72]/10",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm min-h-[38px]",
      md: "px-6 py-3 text-sm min-h-[44px]",
      lg: "px-8 py-4 text-base min-h-[52px]",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
