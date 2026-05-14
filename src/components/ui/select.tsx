"use client";

import { Check, ChevronDown, X } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/cn";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "onChange" | "value"
> & {
  name?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value: string;
  wrapperClassName?: string;
};

export function Select({
  className,
  disabled,
  id,
  name,
  onValueChange,
  options,
  placeholder = "Select...",
  value,
  wrapperClassName,
  ...props
}: SelectProps) {
  const generatedId = useId().replaceAll(":", "");
  const triggerId = id ?? `select-${generatedId}`;
  const listboxId = `${triggerId}-listbox`;
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const hasValue = value.length > 0;
  const selectedLabel = selectedOption?.label ?? value;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const firstEnabledIndex = useMemo(
    () => options.findIndex((option) => !option.disabled),
    [options],
  );
  const fallbackIndex =
    selectedIndex >= 0 && !options[selectedIndex]?.disabled
      ? selectedIndex
      : firstEnabledIndex;
  const [activeIndex, setActiveIndex] = useState(fallbackIndex);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const openListbox = () => {
    if (disabled) {
      return;
    }

    setActiveIndex(fallbackIndex);
    setOpen(true);
  };

  const closeListbox = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const selectOption = (option: SelectOption) => {
    if (option.disabled) {
      return;
    }

    onValueChange(option.value);
    closeListbox();
  };

  const clearValue = () => {
    onValueChange("");
    setOpen(false);
    triggerRef.current?.focus();
  };

  const moveActiveOption = (direction: 1 | -1) => {
    if (options.length === 0) {
      return;
    }

    const nextIndex = getNextEnabledIndex(
      options,
      activeIndex >= 0 ? activeIndex : fallbackIndex,
      direction,
    );

    if (nextIndex >= 0) {
      setActiveIndex(nextIndex);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        openListbox();
        return;
      }

      moveActiveOption(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();

      const nextIndex =
        event.key === "Home"
          ? firstEnabledIndex
          : getNextEnabledIndex(options, 0, -1);

      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        setOpen(true);
      }
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!open) {
        openListbox();
        return;
      }

      const option = options[activeIndex];
      if (option) {
        selectOption(option);
      }
      return;
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      closeListbox();
    }
  };

  return (
    <span className={cn("relative block", wrapperClassName)} ref={rootRef}>
      {name ? <input name={name} type="hidden" value={value} /> : null}
      <button
        aria-activedescendant={
          open && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        aria-controls={open ? listboxId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-9 w-full items-center justify-between gap-3 rounded-md border-2 border-border bg-background/50 py-1 pl-3 pr-10 font-mono text-sm text-foreground shadow-sm transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          hasValue && "pr-16",
          !hasValue && "text-muted-foreground",
          className,
        )}
        disabled={disabled}
        id={triggerId}
        onClick={() => (open ? setOpen(false) : openListbox())}
        onKeyDown={handleKeyDown}
        ref={triggerRef}
        role="combobox"
        type="button"
        {...props}
      >
        <span className="min-w-0 truncate">
          {hasValue ? selectedLabel : placeholder}
        </span>
      </button>
      {hasValue ? (
        <button
          aria-label="Clear selected option"
          className="absolute right-8 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          disabled={disabled}
          onClick={clearValue}
          type="button"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent transition-transform",
          open && "rotate-180",
        )}
      />

      {open ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-50 max-h-56 overflow-y-auto rounded-md border-2 border-accent/60 bg-popover p-1 text-popover-foreground shadow-accent"
          id={listboxId}
          role="listbox"
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            const active = index === activeIndex;

            return (
              <div
                aria-disabled={option.disabled || undefined}
                aria-selected={selected}
                className={cn(
                  "flex cursor-pointer select-none items-center justify-between gap-3 rounded-sm px-2 py-2 font-mono text-xs outline-none transition-colors",
                  active && "bg-accent text-accent-foreground",
                  selected && !active && "text-accent",
                  option.disabled &&
                    "pointer-events-none cursor-not-allowed text-muted-foreground",
                )}
                id={`${listboxId}-option-${index}`}
                key={option.value}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
              >
                <span className="truncate">{option.label}</span>
                {selected ? <Check className="h-4 w-4 shrink-0" /> : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </span>
  );
}

function getNextEnabledIndex(
  options: SelectOption[],
  currentIndex: number,
  direction: 1 | -1,
) {
  if (options.length === 0) {
    return -1;
  }

  for (let offset = 1; offset <= options.length; offset += 1) {
    const index =
      (currentIndex + offset * direction + options.length) % options.length;

    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}
