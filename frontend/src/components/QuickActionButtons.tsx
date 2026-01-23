import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  action: string;
}

interface QuickActionButtonsProps {
  actions: QuickAction[];
  onSelect: (action: string) => void;
}

const QuickActionButtons = ({ actions, onSelect }: QuickActionButtonsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto animate-scale-in">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-4 px-6 justify-start gap-3 hover:bg-gradient-hero hover:border-primary/50 transition-all group"
            onClick={() => onSelect(action.action)}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:shadow-glow transition-shadow">
              <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-left font-medium">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default QuickActionButtons;
