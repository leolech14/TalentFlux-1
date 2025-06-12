import { Intent } from './IntentRouter';

// Synonym mapping for quick intent resolution
const synonymMap: Record<string, string> = {
  'post a job': 'open-job-form',
  'create job': 'open-job-form',
  'hire': 'open-job-form',
  'job posting': 'open-job-form',
  'new job': 'open-job-form',
  'upload cv': 'upload-cv',
  'upload resume': 'upload-cv',
  'add cv': 'upload-cv',
  'create cv': 'create-cv',
  'create resume': 'create-cv',
  'build cv': 'create-cv',
  'make cv': 'create-cv',
  'cv assistant': 'cv-assistant',
  'ai cv': 'cv-assistant',
  'cv helper': 'cv-assistant',
  'resume assistant': 'cv-assistant',
  'show candidates': 'view-candidates',
  'find candidates': 'view-candidates',
  'candidate list': 'view-candidates',
  'view talent': 'view-candidates',
  'go to dashboard': 'go-to-dashboard',
  'home': 'go-to-dashboard',
  'main page': 'go-to-dashboard',
  'dashboard': 'go-to-dashboard',
  'find jobs': 'view-jobs',
  'job search': 'view-jobs',
  'available jobs': 'view-jobs',
  'browse jobs': 'view-jobs',
  'my applications': 'view-applications',
  'application status': 'view-applications',
  'applied jobs': 'view-applications',
  'company settings': 'manage-company',
  'company profile': 'manage-company',
  'organization': 'manage-company',
  'search talent': 'find-talent',
  'find talent': 'find-talent',
  'talent pool': 'find-talent',
  'open menu': 'open-sidebar',
  'show menu': 'open-sidebar',
  'navigation': 'open-sidebar',
  'open sidebar': 'open-sidebar'
};

// Keywords for intent classification
const intentKeywords: Record<string, string[]> = {
  'open-job-form': ['job', 'post', 'create', 'hire', 'position', 'role', 'opening'],
  'view-candidates': ['candidate', 'applicant', 'talent', 'people', 'resume', 'cv'],
  'upload-cv': ['upload', 'cv', 'resume', 'profile', 'experience'],
  'create-cv': ['create', 'build', 'make', 'generate', 'cv', 'resume'],
  'cv-assistant': ['cv', 'assistant', 'ai', 'helper', 'voice', 'interview', 'questions'],
  'view-jobs': ['jobs', 'position', 'opening', 'opportunity', 'work'],
  'go-to-dashboard': ['dashboard', 'home', 'main', 'overview'],
  'view-applications': ['application', 'applied', 'status', 'progress'],
  'manage-company': ['company', 'organization', 'settings', 'profile'],
  'find-talent': ['search', 'find', 'talent', 'recruit'],
  'open-sidebar': ['menu', 'navigation', 'sidebar', 'nav']
};

export function planFromUtterance(
  raw: string, 
  intentRouter: Record<string, Intent>,
  userType: 'candidate' | 'employer'
): Intent | null {
  const text = raw.toLowerCase().trim();
  
  if (!text) return null;

  // Direct synonym match
  for (const phrase in synonymMap) {
    if (text.includes(phrase)) {
      const intentId = synonymMap[phrase];
      const intent = intentRouter[intentId];
      
      // Check if intent is available for user type
      if (intent && (!intent.userTypes || intent.userTypes.includes(userType))) {
        return intent;
      }
    }
  }

  // Keyword-based scoring
  let bestMatch: { intent: Intent; score: number } | null = null;

  for (const [intentId, keywords] of Object.entries(intentKeywords)) {
    const intent = intentRouter[intentId];
    
    // Skip if intent not available for user type
    if (!intent || (intent.userTypes && !intent.userTypes.includes(userType))) {
      continue;
    }

    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score += 1;
        // Boost score for exact matches
        if (text === keyword || text === `${keyword}s`) {
          score += 2;
        }
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { intent, score };
    }
  }

  return bestMatch?.intent || null;
}

// Generate contextual suggestions based on user type
export function getSuggestedCommands(userType: 'candidate' | 'employer'): string[] {
  if (userType === 'employer') {
    return [
      "Post a new job",
      "View candidates", 
      "Find talent",
      "Open menu"
    ];
  } else {
    return [
      "CV Assistant",
      "Find jobs", 
      "View my applications",
      "Open menu"
    ];
  }
}