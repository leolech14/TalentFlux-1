import { useTheme } from "@/hooks/useTheme";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThemeTest() {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const themes = ['light', 'dark', 'alt', 'minimal'] as const;
  const colors = [
    'background', 'foreground', 'primary', 'secondary', 
    'accent', 'muted', 'card', 'border'
  ];

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Theme & Language Test Page
        </h1>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Theme: <strong>{theme}</strong></p>
            <p>Language: <strong>{language}</strong></p>
          </CardContent>
        </Card>

        {/* Theme Switcher */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Switcher</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {themes.map((t) => (
              <Button
                key={t}
                variant={theme === t ? "default" : "outline"}
                onClick={() => setTheme(t)}
              >
                {t}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {colors.map((color) => (
              <div key={color} className="flex items-center gap-2">
                <div 
                  className={`w-12 h-12 rounded border border-border bg-${color}`}
                  style={{
                    backgroundColor: `hsl(var(--${color}))`
                  }}
                />
                <span className="text-sm font-mono">{color}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Translation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Translation Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{t('dashboard')}</p>
            <p>{t('profile')}</p>
            <p>{t('settings')}</p>
            <p>{t('logout')}</p>
          </CardContent>
        </Card>

        {/* UI Components */}
        <Card>
          <CardHeader>
            <CardTitle>UI Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            
            <div className="p-4 bg-muted rounded">
              <p className="text-muted-foreground">Muted background with muted text</p>
            </div>

            <div className="p-4 bg-accent rounded">
              <p className="text-accent-foreground">Accent background with accent text</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 