
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Since Organization doesn't exist, we'll create a simple admin panel without it
const AdminPanel: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  
  if (!isAdmin()) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">System Management</h2>
        <p className="text-gray-600 mb-6">
          This is the admin panel for managing system settings and configurations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-medium mb-2">User Management</h3>
            <p className="text-sm text-gray-500">Manage user accounts, roles, and permissions</p>
          </div>
          
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-medium mb-2">System Configuration</h3>
            <p className="text-sm text-gray-500">Configure system-wide settings and parameters</p>
          </div>
          
          {isOwner() && (
            <>
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h3 className="font-medium mb-2">Platform Analytics</h3>
                <p className="text-sm text-gray-500">View usage statistics and platform analytics</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h3 className="font-medium mb-2">API Management</h3>
                <p className="text-sm text-gray-500">Manage API keys and external integrations</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
