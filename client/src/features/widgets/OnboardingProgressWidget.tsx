import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OnboardingProgressWidget() {
  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle>Onboarding Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Coming soon...</p>
      </CardContent>
    </Card>
  );
} 