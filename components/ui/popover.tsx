// components/ui/popover.tsx
import * as React from "react";

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(
  undefined
);

function usePopoverContext() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error(
      "Popover components must be used within a Popover component"
    );
  }
  return context;
}

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setUncontrolledOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  PopoverTriggerProps
>(({ asChild, ...props }, ref) => {
  const { open, onOpenChange } = usePopoverContext();

  if (asChild) {
    return React.cloneElement(props.children as React.ReactElement, {
      ref,
      onClick: (e: React.MouseEvent) => {
        (props.children as React.ReactElement).props?.onClick?.(e);
        onOpenChange(!open);
      },
    });
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-expanded={open}
      onClick={() => onOpenChange(!open)}
      {...props}
    />
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(({ className, ...props }, ref) => {
  const { open, onOpenChange } = usePopoverContext();

  if (!open) {
    return null;
  }

  return (
    <div className="relative z-50">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />
      <div
        ref={ref}
        className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
        {...props}
      />
    </div>
  );
});
PopoverContent.displayName = "PopoverContent";
