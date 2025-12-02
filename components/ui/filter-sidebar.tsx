"use client";

import { X, Filter, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface ToggleFilterProps {
  readonly id: string;
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (value: boolean) => void;
  readonly description?: string;
}

function ToggleFilter({ id, label, checked, onChange, description }: ToggleFilterProps) {
  return (
    <>
      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {label}
        </Label>
        <button
          id={id}
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${checked ? "bg-primary" : "bg-gray-300"}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${checked ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>
      </div>
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed">
          {description}
        </p>
      )}
    </>
  );
}

interface FilterSectionProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly children: ReactNode;
}

function FilterSection({ icon: Icon, title, children }: FilterSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

interface FilterSidebarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ReactNode;
  readonly footer?: string;
  readonly stickyTop?: string;
}

export function FilterSidebar({
  isOpen,
  onClose,
  title,
  children,
  footer,
  stickyTop = "top-0",
}: FilterSidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-label="Close filters overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky ${stickyTop} left-0 h-screen lg:h-auto
          w-80 lg:w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          z-50 lg:z-0 overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 lg:p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-gray-900">{title}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {children}

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Footer */}
          {footer && (
            <div className="text-xs text-gray-400 italic">
              {footer}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// Export sub-components
FilterSidebar.Section = FilterSection;
FilterSidebar.Toggle = ToggleFilter;
