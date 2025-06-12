import { useAuth } from './useAuth';

export function useUserType(): 'candidate' | 'employer' {
  const { user } = useAuth();
  return (user?.userType as 'candidate' | 'employer') || 'candidate';
}