export interface IntentModule {
  id: string;
  label: string;
  keywords: string[];
  userTypes: ("candidate" | "employer")[];
  action: (navigate: (path: string) => void) => void;
}

class IntentRegistryClass {
  private intents: Map<string, IntentModule> = new Map();

  register(intent: IntentModule) {
    this.intents.set(intent.id, intent);
  }

  getIntent(id: string): IntentModule | undefined {
    return this.intents.get(id);
  }

  getHotIntents(userType: "candidate" | "employer"): IntentModule[] {
    return Array.from(this.intents.values())
      .filter(intent => intent.userTypes.includes(userType))
      .slice(0, 3); // Return top 3 hot intents
  }

  findIntentByKeywords(keywords: string[], userType: "candidate" | "employer"): IntentModule | undefined {
    const userIntents = Array.from(this.intents.values()).filter(intent =>
      intent.userTypes.includes(userType)
    );

    for (const intent of userIntents) {
      for (const keyword of keywords) {
        if (intent.keywords.some(k => keyword.toLowerCase().includes(k.toLowerCase()))) {
          return intent;
        }
      }
    }

    return undefined;
  }
}

export const IntentRegistry = new IntentRegistryClass();

// Register widget intents
import { widgetRegistry } from './WidgetRegistry';

widgetRegistry.forEach(widget => {
  if (widget.intent) {
    IntentRegistry.register({
      id: widget.intent,
      label: `Open ${widget.label}`,
      keywords: [widget.label.toLowerCase(), 'show', 'open', 'display'],
      userTypes: widget.userTypes,
      action: (navigate) => {
        // For now, just log - in a real app this would open the widget
        console.log(`Opening widget: ${widget.label}`);
        // Could implement widget focus/highlighting here
      }
    });
  }
});

// Register default intents
IntentRegistry.register({
  id: "open-dashboard",
  label: "Go to Dashboard",
  keywords: ["dashboard", "home", "main"],
  userTypes: ["candidate", "employer"],
  action: (navigate) => navigate("/dashboard"),
});

IntentRegistry.register({
  id: "open-candidates",
  label: "My Candidates",
  keywords: ["candidates", "applicants", "people"],
  userTypes: ["employer"],
  action: (navigate) => navigate("/dashboard"),
});

IntentRegistry.register({
  id: "browse-jobs",
  label: "Browse Jobs",
  keywords: ["jobs", "opportunities", "positions"],
  userTypes: ["candidate"],
  action: (navigate) => navigate("/dashboard"),
});
