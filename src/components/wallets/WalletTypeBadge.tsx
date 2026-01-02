import { cn } from "@/lib/utils";

export type WalletType = "KOL" | "Whale" | "Good trader" | "Insider" | "Excellent trader";

interface WalletTypeBadgeProps {
  type: WalletType;
  className?: string;
}

const typeStyles: Record<WalletType, string> = {
  Whale: "bg-blue-100 text-blue-700",
  KOL: "bg-purple-100 text-purple-700",
  Insider: "bg-red-100 text-red-700",
  "Good trader": "bg-green-100 text-green-700",
  "Excellent trader": "bg-yellow-100 text-yellow-700",
};

export function WalletTypeBadge({ type, className }: WalletTypeBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-xs font-medium",
        typeStyles[type],
        className
      )}
    >
      {type}
    </span>
  );
}