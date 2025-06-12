export class IntentRouter {
  planFromUtterance(utterance: string, userType: string): string {
    const lowerUtterance = utterance.toLowerCase();
    
    // Dashboard navigation
    if (lowerUtterance.includes("dashboard") || lowerUtterance.includes("home")) {
      return "open-dashboard";
    }
    
    // Candidates/Jobs
    if (lowerUtterance.includes("candidate") || lowerUtterance.includes("job")) {
      return userType === "employer" ? "open-candidates" : "browse-jobs";
    }
    
    // Analytics
    if (lowerUtterance.includes("analytics") || lowerUtterance.includes("stats") || lowerUtterance.includes("business")) {
      return "business-panel";
    }
    
    // Profile
    if (lowerUtterance.includes("profile") || lowerUtterance.includes("settings")) {
      return "open-profile";
    }
    
    // Applications
    if (lowerUtterance.includes("application")) {
      return userType === "candidate" ? "my-applications" : "review-applications";
    }
    
    // Default
    return "open-dashboard";
  }

  executeIntent(intent: string, navigate: (path: string) => void) {
    switch (intent) {
      case "open-dashboard":
        navigate("/dashboard");
        break;
      case "open-candidates":
      case "browse-jobs":
        navigate("/dashboard"); // Will show appropriate view based on user type
        break;
      case "business-panel":
        navigate("/dashboard"); // Would open analytics panel
        break;
      case "open-profile":
        navigate("/profile");
        break;
      case "my-applications":
      case "review-applications":
        navigate("/applications");
        break;
      default:
        navigate("/dashboard");
    }
  }
}
