import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import ViewerDashboard from './ViewerDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // This shouldn't happen due to protected route, but just in case
  }

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Viewer':
      return <ViewerDashboard />;
    case 'User':
    case 'SelfOnly':
      return <UserDashboard />;
    default:
      return <UserDashboard />; // Default to user dashboard
  }
};

export default Dashboard;
