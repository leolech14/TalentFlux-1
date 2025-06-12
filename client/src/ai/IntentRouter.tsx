import { useLocation } from "wouter";

export interface Intent {
  id: string;
  description: string;
  action: (navigate: (path: string) => void) => void;
  userTypes?: Array<'candidate' | 'employer'>;
}

export function useIntentRouter() {
  const [, navigate] = useLocation();

  const intentRouter: Record<string, Intent> = {
    'open-job-form': {
      id: 'open-job-form',
      description: 'Opening job posting form',
      action: () => navigate('/dashboard?panel=job-form'),
      userTypes: ['employer']
    },
    'view-candidates': {
      id: 'view-candidates',
      description: 'Showing candidate list',
      action: () => navigate('/dashboard?panel=candidate-list'),
      userTypes: ['employer']
    },
    'upload-cv': {
      id: 'upload-cv',
      description: 'Opening CV upload form',
      action: () => navigate('/dashboard?panel=cv-upload'),
      userTypes: ['candidate']
    },
    'create-cv': {
      id: 'create-cv',
      description: 'Creating your CV with AI',
      action: () => navigate('/create-cv'),
      userTypes: ['candidate']
    },
    'cv-assistant': {
      id: 'cv-assistant',
      description: 'Opening AI CV Assistant',
      action: (navigate) => {
        // Trigger CV Assistant overlay directly
        window.dispatchEvent(new CustomEvent('open-cv-assistant'));
      },
      userTypes: ['candidate']
    },
    'view-jobs': {
      id: 'view-jobs',
      description: 'Showing available jobs',
      action: () => navigate('/dashboard?panel=job-list'),
      userTypes: ['candidate']
    },
    'go-to-dashboard': {
      id: 'go-to-dashboard',
      description: 'Going to dashboard',
      action: () => navigate('/dashboard'),
      userTypes: ['candidate', 'employer']
    },
    'view-applications': {
      id: 'view-applications',
      description: 'Showing your applications',
      action: () => navigate('/dashboard?panel=applications'),
      userTypes: ['candidate']
    },
    'manage-company': {
      id: 'manage-company',
      description: 'Opening company settings',
      action: () => navigate('/dashboard?panel=company-settings'),
      userTypes: ['employer']
    },
    'find-talent': {
      id: 'find-talent',
      description: 'Searching for talent',
      action: () => navigate('/dashboard?panel=talent-search'),
      userTypes: ['employer']
    },
    'open-sidebar': {
      id: 'open-sidebar',
      description: 'Opening navigation menu',
      action: () => {
        // This will be handled by AppShell
        window.dispatchEvent(new CustomEvent('openSidebar'));
      },
      userTypes: ['candidate', 'employer']
    }
  };

  const executeIntent = (intent: Intent) => {
    intent.action(navigate);
  };

  const getAvailableIntents = (userType: 'candidate' | 'employer') => {
    return Object.values(intentRouter).filter(intent => 
      !intent.userTypes || intent.userTypes.includes(userType)
    );
  };

  return {
    intentRouter,
    executeIntent,
    getAvailableIntents
  };
}