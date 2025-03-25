"use client";
import * as React from "react";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined
);

function useSelectContext(): SelectContextType {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select component");
  }
  return context;
}

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
}: SelectProps) {
  const [selectedValue, setSelectedValue] = React.useState<string>(
    value !== undefined ? value : defaultValue || ""
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setSelectedValue(newValue);
      }
      onValueChange?.(newValue);
      setOpen(false);
    },
    [onValueChange, value]
  );

  return (
    <SelectContext.Provider
      value={{
        value: selectedValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(({ className, children, ...props }, ref) => {
  const { value, open, setOpen } = useSelectContext();

  return (
    <button
      ref={ref}
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      onClick={() => setOpen(!open)}
      aria-haspopup="listbox"
      aria-expanded={open}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
});

// Manually add displayName to resolve TypeScript error
(SelectTrigger as React.FC).displayName = "SelectTrigger";

export const SelectValue = ({
  placeholder,
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) => {
  const { value } = useSelectContext();
  return <span>{value ? children : placeholder}</span>;
};

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useSelectContext();

  if (!open) {
    return null;
  }

  return (
    <div className="relative z-50">
      <div
        className="fixed inset-0"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={ref}
        className={`absolute z-50 w-full rounded-md border border-gray-700 bg-gray-800 text-white shadow-md ${className || ""}`}
        style={{
          top: "100%", // Abre abaixo do SelectTrigger
          marginTop: "4px", // Pequeno espaço entre o trigger e o dropdown
          maxHeight: "200px", // Altura máxima fixa para evitar overflow
          overflowY: "auto", // Scroll vertical se necessário
          maxWidth: "100%", // Garante que não ultrapasse o contêiner pai
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

SelectContent.displayName = "SelectContent";

interface SelectItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value: string;
}

export const SelectItem = React.forwardRef<HTMLLIElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useSelectContext();
    const isSelected = selectedValue === value;

    return (
      <li
        ref={ref}
        className={`relative flex cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-purple-700 focus:text-white hover:bg-purple-700 hover:text-white truncate ${
          isSelected ? "bg-purple-700 text-white" : ""
        } ${className || ""}`}
        role="option"
        aria-selected={isSelected}
        data-value={value}
        onClick={() => onValueChange(value)}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          )}
        </span>
        <span className="truncate">{children}</span>
      </li>
    );
  }
);

SelectItem.displayName = "SelectItem";
