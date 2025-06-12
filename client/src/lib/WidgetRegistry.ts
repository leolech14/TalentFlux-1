export interface WidgetModule {
  id: string;
  label: string;
  component: React.ComponentType<any>;
  userTypes: ("candidate" | "employer")[];
  size: "small" | "medium" | "large";
  category: string;
}

class WidgetRegistryClass {
  private widgets: Map<string, WidgetModule> = new Map();

  register(widget: WidgetModule) {
    this.widgets.set(widget.id, widget);
  }

  getWidget(id: string): WidgetModule | undefined {
    return this.widgets.get(id);
  }

  getWidgetsForUserType(userType: "candidate" | "employer"): WidgetModule[] {
    return Array.from(this.widgets.values()).filter(widget =>
      widget.userTypes.includes(userType)
    );
  }

  getAllWidgets(): WidgetModule[] {
    return Array.from(this.widgets.values());
  }
}

export const WidgetRegistry = new WidgetRegistryClass();
