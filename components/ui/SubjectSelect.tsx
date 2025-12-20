import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { subjects } from "@/lib/constants";
import React from "react";

interface SubjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function SubjectSelect({ value, onChange, disabled, error, className }: SubjectSelectProps) {
  return (
    <div className={className}>
      <Label className="text-sm font-medium">
        Subject <span className="text-red-500">*</span>
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={error && !value ? "border-red-500" : ""}>
          <SelectValue placeholder="Select subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subj) => (
            <SelectItem key={subj} value={subj}>
              {subj}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 