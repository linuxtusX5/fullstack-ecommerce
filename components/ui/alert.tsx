import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type AlertType = "error" | "success" | "info";

const styles: Record<AlertType, { wrapper: string; icon: React.ReactNode }> = {
  error: {
    wrapper: "bg-red-50 border-red-200 text-red-800",
    icon: <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />,
  },
  success: {
    wrapper: "bg-green-50 border-green-200 text-green-800",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />,
  },
  info: {
    wrapper: "bg-blue-50 border-blue-200 text-blue-800",
    icon: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
  },
};

type Props = {
  type?: AlertType;
  message: string;
  className?: string;
};

export function Alert({ type = "info", message, className }: Props) {
  const { wrapper, icon } = styles[type];
  return (
    <div
      className={`${wrapper} flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${className ?? ""}`}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}
