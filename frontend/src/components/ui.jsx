import { cn } from "../utils/helpers";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  ...props
}) {
  const variants = {
    primary: "bg-sketch-accent text-sketch-ink border-2 border-sketch-ink",
    secondary: "bg-[#B7F7D0] text-sketch-ink border-2 border-sketch-ink",
    danger: "bg-sketch-secondary text-white border-2 border-sketch-ink",
    outline: "bg-white text-sketch-ink border-2 border-sketch-ink",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-black transition-all sketch-btn",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function Input({ className, error, label, helperText, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-black text-sketch-ink mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={cn(
          "sketch-input w-full",
          error && "border-red-500 focus:border-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-red-600 text-sm font-semibold mt-2">{error}</p>}
      {helperText && <p className="text-gray-600 text-sm mt-2">{helperText}</p>}
    </div>
  );
}

export function Textarea({ className, error, label, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-black text-sketch-ink mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "sketch-input w-full resize-none font-sans",
          error && "border-red-500 focus:border-red-500",
          className,
        )}
        rows="4"
        {...props}
      />
      {error && <p className="text-red-600 text-sm font-semibold mt-2">{error}</p>}
    </div>
  );
}

export function Card({ children, className, ...props }) {
  return (
    <div className={cn("sketch-card p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = "primary", className }) {
  const variants = {
    primary: "bg-[#D6ECFF] text-sketch-ink status-pill",
    secondary: "bg-[#FFE0DC] text-sketch-ink status-pill",
    success: "bg-[#DDFBEA] text-sketch-ink status-pill",
    error: "bg-[#FFE0DC] text-sketch-ink status-pill",
  };

  return (
    <span
      className={cn(
        "inline-block px-3 py-1 rounded-full text-xs font-black",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 bg-sketch-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg sketch-card animate-fade-in p-6 w-full",
          sizes[size],
        )}
      >
        {title && (
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-dashed border-sketch-ink">
            <h2 className="text-3xl font-doodle font-bold text-sketch-ink">{title}</h2>
            <button
              onClick={onClose}
              className="text-sketch-ink hover:text-sketch-secondary font-black text-2xl leading-none"
              aria-label="Close modal"
            >
              x
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function Select({ className, error, label, options, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-black text-sketch-ink mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        className={cn(
          "sketch-input w-full",
          error && "border-red-500 focus:border-red-500",
          className,
        )}
        {...props}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm font-semibold mt-2">{error}</p>}
    </div>
  );
}

