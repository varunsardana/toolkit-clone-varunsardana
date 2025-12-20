import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { difficultyLevels } from "@/lib/constants";
import React from "react";

interface DifficultySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function DifficultySelect({ value, onChange, disabled, error, className }: DifficultySelectProps) {
  return (
    <div className={className}>
      <Label className="text-sm font-medium">Difficulty Level</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={error && !value ? "border-red-500" : ""}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {difficultyLevels.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              <div className="flex flex-col">
                <span>{level.label}</span>
                <span className="text-xs text-muted-foreground">{level.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 