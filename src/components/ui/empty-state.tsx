import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, message, actionLabel, onAction, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-4 max-w-sm">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="bg-background">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
