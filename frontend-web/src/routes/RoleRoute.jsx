import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  console.log('RoleRoute - user:', user); // Debug
  console.log('RoleRoute - allowedRoles:', allowedRoles); // Debug

  if (!user) {
    console.log('RoleRoute - No user, redirecting to login'); // Debug
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log('RoleRoute - Unauthorized role:', user.role); // Debug
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('RoleRoute - Rendering children'); // Debug
  return children;
}
