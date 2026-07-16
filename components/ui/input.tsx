import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`
            "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none",
            "placeholder:text-gray-400",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
            "transition-all duration-150",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            ${className},`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
