import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export type FilterCategory = "budget" | "premium" | "quick-meal" | "family" | "healthy";

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  activeFilters: FilterCategory[];
  onFiltersChange: (filters: FilterCategory[]) => void;
}

const filterOptions: { id: FilterCategory; label: string; description: string }[] = [
  { id: "budget", label: "Budget-Friendly", description: "Items under £10/kg" },
  { id: "premium", label: "Premium Picks", description: "Top-quality premium products" },
  { id: "quick-meal", label: "Quick Meals", description: "Easy to prepare, fast cooking" },
  { id: "family", label: "Family Sized", description: "Larger portions for families" },
  { id: "healthy", label: "Healthy Choice", description: "Lean and nutritious options" },
];

const FilterPanel = ({ open, onClose, activeFilters, onFiltersChange }: FilterPanelProps) => {
  const toggleFilter = (id: FilterCategory) => {
    if (activeFilters.includes(id)) {
      onFiltersChange(activeFilters.filter((f) => f !== id));
    } else {
      onFiltersChange([...activeFilters, id]);
    }
  };

  if (!open) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-bold text-foreground">Filter by feeling</h3>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close filters">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">What are you in the mood for today?</p>

      <div className="space-y-3">
        {filterOptions.map((option) => (
          <div key={option.id} className="flex items-start gap-3">
            <Checkbox
              id={`filter-${option.id}`}
              checked={activeFilters.includes(option.id)}
              onCheckedChange={() => toggleFilter(option.id)}
            />
            <div>
              <Label htmlFor={`filter-${option.id}`} className="text-sm font-semibold text-foreground cursor-pointer">
                {option.label}
              </Label>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </div>
        ))}
      </div>

      {activeFilters.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => onFiltersChange([])}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};

export default FilterPanel;
