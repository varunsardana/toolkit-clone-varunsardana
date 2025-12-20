import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import React from "react";

const questionCounts = [
  { value: "3", label: "3 Questions" },
  { value: "5", label: "5 Questions" },
  { value: "10", label: "10 Questions" },
  { value: "15", label: "15 Questions" },
  { value: "20", label: "20 Questions" },
];

interface QuestionCountSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function QuestionCountSelect({ value, onChange, disabled, error, className }: QuestionCountSelectProps) {
  return (
    <div className={className}>
      <Label className="text-sm font-medium">Number of Questions</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={error && !value ? "border-red-500" : ""}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {questionCounts.map((q) => (
            <SelectItem key={q.value} value={q.value}>
              {q.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 