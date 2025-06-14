import React from "react";
import { useTheme } from "@/hooks/useTheme";
import * as Popover from "@radix-ui/react-popover";
import { Sun, Moon, Palette, Square, Terminal } from "lucide-react";

const options = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  alt: { icon: Palette, label: "Alt" },
  minimal: { icon: Square, label: "Minimal" },
  matrix: { icon: Terminal, label: "Matrix" },
} as const;

type ThemeKey = keyof typeof options;

export function ThemeSwitch() {
  const theme = useTheme((state) => state.theme);
  const setTheme = useTheme((state) => state.setTheme);

  // Ensure we have a valid theme
  const currentTheme: ThemeKey = (theme && theme in options) ? theme as ThemeKey : 'dark';
  const CurrentIcon = options[currentTheme].icon;

  // Get all themes except the current one
  const availableThemes = (Object.keys(options) as ThemeKey[])
    .filter((opt) => opt !== currentTheme);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border bg-surface bg-opacity-50 backdrop-blur-sm border-border border-opacity-50 text-foreground hover:bg-surface hover:bg-opacity-80 transition-all duration-200">
          <CurrentIcon className="w-3 h-3" />
          <span className="capitalize hidden sm:inline">{options[currentTheme].label}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={4}
          className="rounded-md border bg-popover p-1 shadow-md space-y-0.5 z-50 min-w-[100px] max-w-[150px]"
          collisionPadding={10}
        >
          {availableThemes.length > 0 ? (
            availableThemes.map((opt) => {
              const Icon = options[opt].icon;
              return (
                <button
                  key={opt}
                  className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1 text-xs hover:bg-accent text-popover-foreground hover:text-accent-foreground transition-colors"
                  onClick={() => setTheme(opt)}
                >
                  <Icon className="w-3 h-3" />
                  <span className="capitalize">{options[opt].label}</span>
                </button>
              );
            })
          ) : (
            <div className="px-2 py-1 text-xs text-muted-foreground">
              No other themes available
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}