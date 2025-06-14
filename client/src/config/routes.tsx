import { lazy } from "react";
import { 
  Home, 
  Users, 
  Briefcase, 
  FileText, 
  Search, 
  Building2, 
  UserCheck, 
  BarChart3, 
  Settings, 
  CreditCard,
  MessageSquare,
  BookOpen,
  Award,
  Calendar,
  Mail,
  Shield,
  HelpCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users2,
  Zap,
  Globe,
  DollarSign,
  FileCheck,
  UserPlus,
  BrainCircuit,
  Rocket,
  GraduationCap,
  Lightbulb,
  Network
} from "lucide-react";

// Lazy load pages for better performance
const Landing = lazy(() => import("@/pages/landing"));
const Login = lazy(() => import("@/pages/login"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Define route types
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<any>;
  title: string;
  description?: string;
  icon?: React.ElementType;
  requiresAuth?: boolean;
  requiresRole?: "candidate" | "employer" | "admin";
  children?: RouteConfig[];
  showInNav?: boolean;
  badge?: string;
}

// Professional route configuration
export const routes: RouteConfig[] = [
  // Public Routes
  {
    path: "/",
    component: Landing,
    title: "Home",
    icon: Home,
    showInNav: false,
  },
  {
    path: "/login",
    component: lazy(() => import("@/pages/login")),
    title: "Login",
    showInNav: false,
  },
  {
    path: "/signup",
    component: lazy(() => import("@/pages/signup")),
    title: "Sign Up",
    showInNav: false,
  },
  {
    path: "/forgot-password",
    component: lazy(() => import("@/pages/forgot-password")),
    title: "Forgot Password",
    showInNav: false,
  },

  // Onboarding Routes
  {
    path: "/onboarding",
    component: lazy(() => import("@/pages/onboarding")),
    title: "Get Started",
    requiresAuth: true,
    showInNav: false,
  },
  {
    path: "/onboarding/candidate",
    component: lazy(() => import("@/pages/onboarding-candidate")),
    title: "Candidate Onboarding",
    requiresAuth: true,
    showInNav: false,
  },
  {
    path: "/onboarding/employer",
    component: lazy(() => import("@/pages/onboarding-employer")),
    title: "Employer Onboarding",
    requiresAuth: true,
    showInNav: false,
  },

  // Main Dashboard
  {
    path: "/dashboard",
    component: Dashboard,
    title: "Dashboard",
    icon: BarChart3,
    requiresAuth: true,
    showInNav: true,
  },

  // Candidate Routes
  {
    path: "/cv",
    component: lazy(() => import("@/pages/cv/index")),
    title: "CV Builder",
    icon: FileText,
    requiresAuth: true,
    requiresRole: "candidate",
    showInNav: true,
    children: [
      {
        path: "/cv/create",
        component: lazy(() => import("@/pages/cv/create")),
        title: "Create New CV",
        icon: Sparkles,
        badge: "AI Powered",
      },
      {
        path: "/cv/templates",
        component: lazy(() => import("@/pages/cv/templates")),
        title: "CV Templates",
        icon: FileCheck,
      },
      {
        path: "/cv/history",
        component: lazy(() => import("@/pages/cv/history")),
        title: "My CVs",
        icon: FileText,
      },
      {
        path: "/cv/:id/edit",
        component: lazy(() => import("@/pages/cv/edit")),
        title: "Edit CV",
        showInNav: false,
      },
    ],
  },
  {
    path: "/jobs",
    component: lazy(() => import("@/pages/jobs/index")),
    title: "Job Search",
    icon: Search,
    requiresAuth: true,
    requiresRole: "candidate",
    showInNav: true,
    children: [
      {
        path: "/jobs/browse",
        component: lazy(() => import("@/pages/jobs/browse")),
        title: "Browse Jobs",
        icon: Globe,
      },
      {
        path: "/jobs/matches",
        component: lazy(() => import("@/pages/jobs/matches")),
        title: "AI Matches",
        icon: Target,
        badge: "Smart",
      },
      {
        path: "/jobs/saved",
        component: lazy(() => import("@/pages/jobs/saved")),
        title: "Saved Jobs",
        icon: BookOpen,
      },
      {
        path: "/jobs/:id",
        component: lazy(() => import("@/pages/jobs/detail")),
        title: "Job Details",
        showInNav: false,
      },
    ],
  },
  {
    path: "/applications",
    component: lazy(() => import("@/pages/applications/index")),
    title: "Applications",
    icon: Briefcase,
    requiresAuth: true,
    requiresRole: "candidate",
    showInNav: true,
    children: [
      {
        path: "/applications/active",
        component: lazy(() => import("@/pages/applications/active")),
        title: "Active Applications",
        icon: Zap,
      },
      {
        path: "/applications/interviews",
        component: lazy(() => import("@/pages/applications/interviews")),
        title: "Interviews",
        icon: Calendar,
        badge: "2 Upcoming",
      },
      {
        path: "/applications/offers",
        component: lazy(() => import("@/pages/applications/offers")),
        title: "Offers",
        icon: Award,
      },
    ],
  },
  {
    path: "/career",
    component: lazy(() => import("@/pages/career/index")),
    title: "Career Tools",
    icon: Rocket,
    requiresAuth: true,
    requiresRole: "candidate",
    showInNav: true,
    children: [
      {
        path: "/career/interview-prep",
        component: lazy(() => import("@/pages/career/interview-prep")),
        title: "Interview Prep",
        icon: BrainCircuit,
        badge: "AI Coach",
      },
      {
        path: "/career/skill-assessment",
        component: lazy(() => import("@/pages/career/skill-assessment")),
        title: "Skill Assessment",
        icon: GraduationCap,
      },
      {
        path: "/career/salary-insights",
        component: lazy(() => import("@/pages/career/salary-insights")),
        title: "Salary Insights",
        icon: DollarSign,
      },
      {
        path: "/career/learning-paths",
        component: lazy(() => import("@/pages/career/learning-paths")),
        title: "Learning Paths",
        icon: Lightbulb,
      },
    ],
  },

  // Employer Routes
  {
    path: "/talent",
    component: lazy(() => import("@/pages/talent/index")),
    title: "Talent Pool",
    icon: Users,
    requiresAuth: true,
    requiresRole: "employer",
    showInNav: true,
    children: [
      {
        path: "/talent/search",
        component: lazy(() => import("@/pages/talent/search")),
        title: "Search Candidates",
        icon: Search,
      },
      {
        path: "/talent/recommendations",
        component: lazy(() => import("@/pages/talent/recommendations")),
        title: "AI Recommendations",
        icon: Sparkles,
        badge: "Smart Match",
      },
      {
        path: "/talent/saved",
        component: lazy(() => import("@/pages/talent/saved")),
        title: "Saved Profiles",
        icon: UserCheck,
      },
      {
        path: "/talent/:id",
        component: lazy(() => import("@/pages/talent/profile")),
        title: "Candidate Profile",
        showInNav: false,
      },
    ],
  },
  {
    path: "/posting",
    component: lazy(() => import("@/pages/posting/index")),
    title: "Job Postings",
    icon: Briefcase,
    requiresAuth: true,
    requiresRole: "employer",
    showInNav: true,
    children: [
      {
        path: "/posting/create",
        component: lazy(() => import("@/pages/posting/create")),
        title: "Post New Job",
        icon: UserPlus,
      },
      {
        path: "/posting/active",
        component: lazy(() => import("@/pages/posting/active")),
        title: "Active Jobs",
        icon: Zap,
      },
      {
        path: "/posting/analytics",
        component: lazy(() => import("@/pages/posting/analytics")),
        title: "Job Analytics",
        icon: TrendingUp,
      },
      {
        path: "/posting/:id/edit",
        component: lazy(() => import("@/pages/posting/edit")),
        title: "Edit Job",
        showInNav: false,
      },
      {
        path: "/posting/:id/applicants",
        component: lazy(() => import("@/pages/posting/applicants")),
        title: "View Applicants",
        showInNav: false,
      },
    ],
  },
  {
    path: "/company",
    component: lazy(() => import("@/pages/company/index")),
    title: "Company",
    icon: Building2,
    requiresAuth: true,
    requiresRole: "employer",
    showInNav: true,
    children: [
      {
        path: "/company/profile",
        component: lazy(() => import("@/pages/company/profile")),
        title: "Company Profile",
        icon: Building2,
      },
      {
        path: "/company/team",
        component: lazy(() => import("@/pages/company/team")),
        title: "Team Members",
        icon: Users2,
      },
      {
        path: "/company/branding",
        component: lazy(() => import("@/pages/company/branding")),
        title: "Employer Branding",
        icon: Award,
      },
    ],
  },

  // Shared Routes
  {
    path: "/messages",
    component: lazy(() => import("@/pages/messages/index")),
    title: "Messages",
    icon: MessageSquare,
    requiresAuth: true,
    showInNav: true,
    badge: "3 New",
  },
  {
    path: "/network",
    component: lazy(() => import("@/pages/network/index")),
    title: "Network",
    icon: Network,
    requiresAuth: true,
    showInNav: true,
  },
  {
    path: "/settings",
    component: lazy(() => import("@/pages/settings/index")),
    title: "Settings",
    icon: Settings,
    requiresAuth: true,
    showInNav: true,
    children: [
      {
        path: "/settings/profile",
        component: lazy(() => import("@/pages/settings/profile")),
        title: "Profile Settings",
        icon: UserCheck,
      },
      {
        path: "/settings/notifications",
        component: lazy(() => import("@/pages/settings/notifications")),
        title: "Notifications",
        icon: Mail,
      },
      {
        path: "/settings/privacy",
        component: lazy(() => import("@/pages/settings/privacy")),
        title: "Privacy & Security",
        icon: Shield,
      },
      {
        path: "/settings/billing",
        component: lazy(() => import("@/pages/settings/billing")),
        title: "Billing & Plans",
        icon: CreditCard,
      },
    ],
  },

  // Support & Legal
  {
    path: "/help",
    component: lazy(() => import("@/pages/help/index")),
    title: "Help Center",
    icon: HelpCircle,
    showInNav: true,
  },
  {
    path: "/privacy",
    component: lazy(() => import("@/pages/legal/privacy")),
    title: "Privacy Policy",
    showInNav: false,
  },
  {
    path: "/terms",
    component: lazy(() => import("@/pages/legal/terms")),
    title: "Terms of Service",
    showInNav: false,
  },

  // 404 - Must be last
  {
    path: "*",
    component: NotFound,
    title: "Page Not Found",
    showInNav: false,
  },
];

// Helper functions
export const getPublicRoutes = () => 
  routes.filter(route => !route.requiresAuth);

export const getAuthenticatedRoutes = (role?: "candidate" | "employer" | "admin") =>
  routes.filter(route => 
    route.requiresAuth && 
    (!route.requiresRole || route.requiresRole === role)
  );

export const getNavRoutes = (role?: "candidate" | "employer" | "admin") =>
  getAuthenticatedRoutes(role).filter(route => route.showInNav);

export const getBreadcrumbs = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ path: string; title: string }> = [];
  
  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    const route = findRouteByPath(currentPath);
    if (route) {
      breadcrumbs.push({ path: currentPath, title: route.title });
    }
  }
  
  return breadcrumbs;
};

export const findRouteByPath = (path: string): RouteConfig | undefined => {
  const searchRoutes = (routes: RouteConfig[], searchPath: string): RouteConfig | undefined => {
    for (const route of routes) {
      if (route.path === searchPath) return route;
      if (route.children) {
        const found = searchRoutes(route.children, searchPath);
        if (found) return found;
      }
    }
    return undefined;
  };
  
  return searchRoutes(routes, path);
}; 