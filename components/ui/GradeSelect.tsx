import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { gradeLevels } from "@/lib/constants";
import React from "react";

interface GradeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function GradeSelect({ value, onChange, disabled, error, className }: GradeSelectProps) {
  return (
    <div className={className}>
      <Label className="text-sm font-medium">
        Grade Level <span className="text-red-500">*</span>
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={error && !value ? "border-red-500" : ""}>
          <SelectValue placeholder="Select grade level" />
        </SelectTrigger>
        <SelectContent>
          {gradeLevels.map((grade) => (
            <SelectItem key={grade} value={grade}>
              {grade}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 