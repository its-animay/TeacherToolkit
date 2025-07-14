import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/userSlice';
import { getUserFromStorage } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, navigate] = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    
    if (!storedUser) {
      navigate('/login');
      return;
    }

    if (!user) {
      dispatch(setUser(storedUser));
    }
  }, [user, navigate, dispatch]);

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}