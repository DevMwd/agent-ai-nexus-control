
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Switch } from "./switch"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const SwitchCheckbox = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "checked" | "defaultChecked" | "onCheckedChange"> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ checked, defaultChecked, onCheckedChange, className, ...props }, ref) => (
  <Switch
    ref={ref}
    checked={checked}
    defaultChecked={defaultChecked}
    onCheckedChange={onCheckedChange}
    className={className}
    {...props}
  />
))
SwitchCheckbox.displayName = "SwitchCheckbox"

export { Checkbox, SwitchCheckbox }
