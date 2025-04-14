
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Settings, Palette, Shield, BellRing, Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };
  
  const handleLogoUpload = () => {
    toast({
      title: "Upload Logo",
      description: "Logo upload functionality will be implemented in a future update.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              <AdminNavItem
                icon={<Settings className="w-5 h-5" />}
                label="General Settings"
                active={activeTab === 'general'}
                onClick={() => setActiveTab('general')}
              />
              <AdminNavItem
                icon={<Palette className="w-5 h-5" />}
                label="Appearance"
                active={activeTab === 'appearance'}
                onClick={() => setActiveTab('appearance')}
              />
              <AdminNavItem
                icon={<Users className="w-5 h-5" />}
                label="User Management"
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
              />
              <AdminNavItem
                icon={<Shield className="w-5 h-5" />}
                label="Permissions"
                active={activeTab === 'permissions'}
                onClick={() => setActiveTab('permissions')}
              />
              <AdminNavItem
                icon={<BellRing className="w-5 h-5" />}
                label="Notifications"
                active={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
              />
            </nav>
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'general' && (
              <div>
                <h2 className="text-xl font-bold mb-6">General Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Action AI Platform"
                      defaultValue="Action AI Platform"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Description
                    </label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={4}
                      placeholder="AI Agent Management Platform"
                      defaultValue="Advanced AI Agent Management Platform powered by BlueSky"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Logo</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={handleLogoUpload}
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Logo</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="admin@example.com"
                      defaultValue="admin@example.com"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="action"
                      onClick={handleSaveSettings}
                    >
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="w-12 h-10 cursor-pointer"
                        defaultValue="#9b87f5"
                      />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="#9b87f5"
                        defaultValue="#9b87f5"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="w-12 h-10 cursor-pointer"
                        defaultValue="#7E69AB"
                      />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="#7E69AB"
                        defaultValue="#7E69AB"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="action"
                      onClick={handleSaveSettings}
                    >
                      Save Appearance
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold mb-6">User Management</h2>
                <p className="text-gray-600 mb-6">
                  Manage users and their access levels. This feature will be implemented in a future update.
                </p>
                
                <div className="border border-gray-200 rounded-lg p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">User Management Coming Soon</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    This feature will allow you to add, edit, and manage users with different permission levels.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'permissions' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Permission Settings</h2>
                <p className="text-gray-600 mb-6">
                  Configure access permissions for different user roles. This feature will be implemented in a future update.
                </p>
                
                <div className="border border-gray-200 rounded-lg p-8 text-center">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Permissions Management Coming Soon</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    This feature will allow you to configure detailed permissions for each user role.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
                <p className="text-gray-600 mb-6">
                  Configure system notifications and alerts. This feature will be implemented in a future update.
                </p>
                
                <div className="border border-gray-200 rounded-lg p-8 text-center">
                  <BellRing className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Notification Management Coming Soon</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    This feature will allow you to configure platform notifications and alert preferences.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
        active 
          ? 'bg-action-primary text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default AdminPanel;
