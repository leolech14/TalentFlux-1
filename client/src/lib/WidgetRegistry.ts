import { WidgetModule } from './WidgetTypes';
import { CostPerHireWidget } from '@/features/widgets/CostPerHireWidget';
import { HiringFunnelWidget } from '@/features/widgets/HiringFunnelWidget';
import { JobMatchWidget } from '@/features/widgets/JobMatchWidget';
import { ApplicationTrackingWidget } from '@/features/widgets/ApplicationTrackingWidget';

export const widgetRegistry: WidgetModule[] = [
  // Employer Widgets
  {
    id: 'cost-per-hire',
    label: 'Cost Per Hire',
    userTypes: ['employer'],
    component: CostPerHireWidget,
    intent: 'open-cost-per-hire',
    size: 'medium',
    category: 'analytics',
  },
  {
    id: 'hiring-funnel',
    label: 'Hiring Funnel',
    userTypes: ['employer'],
    component: HiringFunnelWidget,
    intent: 'open-hiring-funnel',
    size: 'medium',
    category: 'analytics',
  },
  // Candidate Widgets
  {
    id: 'job-matches',
    label: 'Job Matches',
    userTypes: ['candidate'],
    component: JobMatchWidget,
    intent: 'open-job-matches',
    size: 'medium',
    category: 'opportunities',
  },
  {
    id: 'application-tracking',
    label: 'Application Tracking',
    userTypes: ['candidate'],
    component: ApplicationTrackingWidget,
    intent: 'open-application-tracking',
    size: 'medium',
    category: 'tracking',
  },
];

class WidgetRegistryClass {
  private widgets: Map<string, WidgetModule> = new Map();

  constructor() {
    // Auto-register all widgets
    widgetRegistry.forEach(widget => this.register(widget));
  }

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

  getWidgetsByCategory(category: string, userType?: "candidate" | "employer"): WidgetModule[] {
    let widgets = Array.from(this.widgets.values()).filter(widget => 
      widget.category === category
    );
    
    if (userType) {
      widgets = widgets.filter(widget => widget.userTypes.includes(userType));
    }
    
    return widgets;
  }
}

export const WidgetRegistry = new WidgetRegistryClass();
