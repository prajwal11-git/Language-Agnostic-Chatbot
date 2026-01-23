import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ title, icon: Icon, children, className, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-gradient-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:shadow-glow transition-shadow">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
};

export default Card;
