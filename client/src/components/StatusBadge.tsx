import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          color: "bg-green-500/15 text-green-500 border-green-500/20",
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />,
          label: "Verified",
        };
      case "processing":
        return {
          color: "bg-blue-500/15 text-blue-500 border-blue-500/20",
          icon: <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />,
          label: "Processing",
        };
      case "failed":
        return {
          color: "bg-red-500/15 text-red-500 border-red-500/20",
          icon: <XCircle className="w-3.5 h-3.5 mr-1.5" />,
          label: "Failed",
        };
      default:
        return {
          color: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1.5" />,
          label: "Pending",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.color,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
