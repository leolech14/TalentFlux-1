import React from "react";
import { useTheme } from "@/hooks/useTheme";
import * as Popover from "@radix-ui/react-popover";
import { Sun, Moon, Palette } from "lucide-react";

const options = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  alt: { icon: Palette, label: "Alt" },
} as const;

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme((s) => ({ theme: s.theme, setTheme: s.setTheme }));
  
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-1 px-3 py-1 rounded-lg border bg-surface/50 backdrop-blur-sm border-border/50 text-foreground hover:bg-surface/80 transition-all duration-200">
          {React.createElement(options[theme].icon, { className: "w-4 h-4" })}
          <span className="capitalize">{options[theme].label}</span>
        </button>
      </Popover.Trigger>

      <Popover.Content
        align="end"
        sideOffset={4}
        className="rounded-lg border bg-popover p-2 shadow-md space-y-1 z-50"
      >
        {(Object.keys(options) as (keyof typeof options)[])
          .filter((opt) => opt !== theme)
          .map((opt) => (
            <button
              key={opt}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-accent text-popover-foreground hover:text-accent-foreground transition-colors"
              onClick={() => setTheme(opt)}
            >
              {React.createElement(options[opt].icon, { className: "w-4 h-4" })}
              <span className="capitalize">{options[opt].label}</span>
            </button>
          ))}
      </Popover.Content>
    </Popover.Root>
  );
} 