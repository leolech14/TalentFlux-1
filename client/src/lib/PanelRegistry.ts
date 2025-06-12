export interface PanelModule {
  id: string;
  label: string;
  component: React.ComponentType<any>;
  userTypes: ("candidate" | "employer")[];
  category: string;
}

class PanelRegistryClass {
  private panels: Map<string, PanelModule> = new Map();

  register(panel: PanelModule) {
    this.panels.set(panel.id, panel);
  }

  getPanel(id: string): PanelModule | undefined {
    return this.panels.get(id);
  }

  getPanelsForUserType(userType: "candidate" | "employer"): PanelModule[] {
    return Array.from(this.panels.values()).filter(panel =>
      panel.userTypes.includes(userType)
    );
  }

  getAllPanels(): PanelModule[] {
    return Array.from(this.panels.values());
  }
}

export const PanelRegistry = new PanelRegistryClass();
