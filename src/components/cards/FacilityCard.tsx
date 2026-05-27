import { ReactNode } from "react";

interface FacilityCardProps {
  title: string;
  icon: ReactNode;
  description?: string;
}

export function FacilityCard({ title, icon, description }: FacilityCardProps) {
  return (
    <div className="group p-6 bg-white dark:bg-card rounded-2xl border border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-foreground text-lg">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
