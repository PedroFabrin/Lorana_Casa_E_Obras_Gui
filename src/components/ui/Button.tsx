import { type ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--cta)] text-white hover:bg-[var(--cta-hover)] disabled:opacity-50",
  outline: "border border-[#C36A2E] text-[#C36A2E] hover:bg-[#C36A2E] hover:text-white disabled:opacity-50",
  ghost: "text-[#0B1B2B] hover:bg-black/5 disabled:opacity-50",
  danger: "border border-red-200 text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth, className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed",
        variantClasses[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
