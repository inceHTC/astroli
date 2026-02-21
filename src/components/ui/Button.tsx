import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-[#1A163E] text-white hover:bg-[#3b3278] shadow-sm hover:shadow-md",

      secondary:
        "bg-white text-black border border-gray-200 hover:bg-gray-100",

      ghost:
        "bg-transparent text-black hover:bg-gray-100",

      outline:
        "border border-[#5B3FFF] text-[#5B3FFF] hover:bg-[#5B3FFF]/10",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm min-h-[40px]",
      md: "px-6 py-3 text-sm min-h-[44px]",
      lg: "px-8 py-4 text-base min-h-[52px]",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
