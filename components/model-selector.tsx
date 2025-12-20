"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { modelCategories } from "@/lib/constants"
import { Separator } from "@/components/ui/separator"

interface ModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
  label?: string
  description?: string
}

export function ModelSelector({ value, onValueChange, label, description }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {modelCategories.map((category, categoryIndex) => (
            <div key={category.name}>
              {categoryIndex > 0 && <Separator className="my-2" />}
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground">{category.description}</div>
              </div>
              {category.models.map((model) => (
                <SelectItem key={model.value} value={model.value} className="pl-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="flex-1">{model.label}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <Badge variant="secondary" className="text-xs">{model.badge}</Badge>
                      {(model as any).free && <Badge variant="outline" className="text-xs text-green-700 border-green-400" title="This model is free to use">Free</Badge>}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
