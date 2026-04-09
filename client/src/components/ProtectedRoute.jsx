import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, agent, admin, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-wwPrimary gap-4">
      <div className="w-10 h-10 border-4 border-wwGold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-wwGold font-bold uppercase tracking-widest text-[10px]">Verifying Credentials...</p>
    </div>
  );

  if (roles.includes('user') && user) return children;
  if (roles.includes('agent') && agent) {
    if (!agent.isApproved) return <Navigate to="/login" replace />;
    return children;
  }
  if (roles.includes('admin') && admin) return children;

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
