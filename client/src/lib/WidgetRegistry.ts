import { WidgetModule } from './WidgetTypes';
import { CostPerHireWidget } from '@/features/widgets/CostPerHireWidget';
import { HiringFunnelWidget } from '@/features/widgets/HiringFunnelWidget';
import { JobMatchWidget } from '@/features/widgets/JobMatchWidget';
import { ApplicationTrackingWidget } from '@/features/widgets/ApplicationTrackingWidget';
import { CVWidget } from '@/features/candidate/CVWidget';
import { InterviewScheduleWidget } from '@/features/widgets/InterviewScheduleWidget';
import { ApplicationMetricsWidget } from '@/features/widgets/ApplicationMetricsWidget';
import { TalentPoolWidget } from '@/features/widgets/TalentPoolWidget';
import { TeamPerformanceWidget } from '@/features/widgets/TeamPerformanceWidget';
import { ComplianceWidget } from '@/features/widgets/ComplianceWidget';
import { RecruitmentROIWidget } from '@/features/widgets/RecruitmentROIWidget';
import { DiversityMetricsWidget } from '@/features/widgets/DiversityMetricsWidget';
import { OnboardingProgressWidget } from '@/features/widgets/OnboardingProgressWidget';
import { InterviewPrepWidget } from "@/features/widgets/InterviewPrepWidget";
import { SkillGapWidget } from "@/features/widgets/SkillGapWidget";
import { CareerPathWidget } from "@/features/widgets/CareerPathWidget";
import { CandidateMatchingWidget } from "@/features/widgets/CandidateMatchingWidget";
import { HiringPipelineWidget } from "@/features/widgets/HiringPipelineWidget";
import { JobPerformanceWidget } from "@/features/widgets/JobPerformanceWidget";

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
  {
    id: 'interview-schedule',
    label: 'Interview Schedule',
    userTypes: ['employer'],
    component: InterviewScheduleWidget,
    intent: 'open-interview-schedule',
    size: 'medium',
    category: 'scheduling',
  },
  {
    id: 'application-metrics',
    label: 'Application Metrics',
    userTypes: ['employer'],
    component: ApplicationMetricsWidget,
    intent: 'open-application-metrics',
    size: 'medium',
    category: 'analytics',
  },
  {
    id: 'talent-pool',
    label: 'Talent Pool',
    userTypes: ['employer'],
    component: TalentPoolWidget,
    intent: 'open-talent-pool',
    size: 'medium',
    category: 'candidates',
  },
  {
    id: 'team-performance',
    label: 'Team Performance',
    userTypes: ['employer'],
    component: TeamPerformanceWidget,
    intent: 'open-team-performance',
    size: 'medium',
    category: 'analytics',
  },
  {
    id: 'compliance',
    label: 'Compliance Status',
    userTypes: ['employer'],
    component: ComplianceWidget,
    intent: 'open-compliance',
    size: 'small',
    category: 'compliance',
  },
  {
    id: 'recruitment-roi',
    label: 'Recruitment ROI',
    userTypes: ['employer'],
    component: RecruitmentROIWidget,
    intent: 'open-recruitment-roi',
    size: 'medium',
    category: 'analytics',
  },
  {
    id: 'diversity-metrics',
    label: 'Diversity Metrics',
    userTypes: ['employer'],
    component: DiversityMetricsWidget,
    intent: 'open-diversity-metrics',
    size: 'medium',
    category: 'analytics',
  },
  {
    id: 'onboarding-progress',
    label: 'Onboarding Progress',
    userTypes: ['employer'],
    component: OnboardingProgressWidget,
    intent: 'open-onboarding-progress',
    size: 'medium',
    category: 'onboarding',
  },
  // Candidate Widgets
  {
    id: 'cv-manager',
    label: 'CV Manager',
    userTypes: ['candidate'],
    component: CVWidget,
    intent: 'create-cv',
    size: 'medium',
    category: 'profile',
  },
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
  // New candidate widgets
  {
    id: 'interviewPrep',
    label: 'Interview Prep Assistant',
    userTypes: ['candidate'],
    component: InterviewPrepWidget,
    intent: 'open-interview-prep',
    size: 'medium',
    category: 'candidate',
  },
  {
    id: 'skillGap',
    label: 'Skill Gap Analysis',
    userTypes: ['candidate'],
    component: SkillGapWidget,
    intent: 'open-skill-gap',
    size: 'medium',
    category: 'candidate',
  },
  {
    id: 'careerPath',
    label: 'Career Path Visualization',
    userTypes: ['candidate'],
    component: CareerPathWidget,
    intent: 'open-career-path',
    size: 'large',
    category: 'candidate',
  },
  // New employer widgets
  {
    id: 'candidateMatching',
    label: 'AI Candidate Matching',
    userTypes: ['employer'],
    component: CandidateMatchingWidget,
    intent: 'open-candidate-matching',
    size: 'large',
    category: 'employer',
  },
  {
    id: 'hiringPipeline',
    label: 'Hiring Pipeline Analytics',
    userTypes: ['employer'],
    component: HiringPipelineWidget,
    intent: 'open-hiring-pipeline',
    size: 'large',
    category: 'employer',
  },
  {
    id: 'jobPerformance',
    label: 'Job Performance Insights',
    userTypes: ['employer'],
    component: JobPerformanceWidget,
    intent: 'open-job-performance',
    size: 'medium',
    category: 'employer',
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
