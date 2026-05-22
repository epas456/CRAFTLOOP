import { cn } from "@/lib/utils";

type MaterialBadgeProps = {
  name: string;
  icon?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export function MaterialBadge({ name, icon, selected, onClick, className }: MaterialBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
        selected
          ? "bg-[#2F5D3A] text-white border-[#2F5D3A] shadow-sm"
          : "bg-white text-gray-600 border-gray-200 hover:border-[#2F5D3A] hover:text-[#2F5D3A]",
        onClick && "cursor-pointer",
        !onClick && "cursor-default",
        className
      )}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      <span>{name}</span>
    </button>
  );
}
