import { apiRequest } from "./queryClient";
import { LoginData, OnboardingData, InsertJob, InsertApplication } from "@shared/schema";

// API configuration utility
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function apiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export const api = {
  auth: {
    login: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    register: async (data: any) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onboarding: async (userId: number, data: OnboardingData) => {
      const response = await apiRequest("POST", "/api/auth/onboarding", { userId, ...data });
      return response.json();
    },
  },
  users: {
    getUser: async (id: number) => {
      const response = await apiRequest("GET", `/api/users/${id}`);
      return response.json();
    },
  },
  jobs: {
    getAll: async () => {
      const response = await apiRequest("GET", "/api/jobs");
      return response.json();
    },
    getByEmployer: async (employerId: number) => {
      const response = await apiRequest("GET", `/api/jobs/employer/${employerId}`);
      return response.json();
    },
    create: async (data: InsertJob) => {
      const response = await apiRequest("POST", "/api/jobs", data);
      return response.json();
    },
  },
  applications: {
    getByCandidate: async (candidateId: number) => {
      const response = await apiRequest("GET", `/api/applications/candidate/${candidateId}`);
      return response.json();
    },
    getByJob: async (jobId: number) => {
      const response = await apiRequest("GET", `/api/applications/job/${jobId}`);
      return response.json();
    },
    create: async (data: InsertApplication) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
  },
};
