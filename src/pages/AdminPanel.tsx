import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Settings, Palette, Shield, BellRing, Upload, PlusCircle, Edit, Trash, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAgents } from '@/contexts/AgentContext';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { isAdmin, isOwner, user } = useAuth();
  const { agents } = useAgents();
  
  const [mockUsers, setMockUsers] = useState([
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: '2', name: 'Base User', email: 'user@example.com', role: 'base' },
    { id: '3', name: 'Owner User', email: 'owner@example.com', role: 'owner' }
  ]);

  const [mockAgentVisibility, setMockAgentVisibility] = useState(
    agents.map(agent => ({
      agentId: agent.id,
      name: agent.title || agent.id,
      visibleToAdmins: true,
      visibleToBaseUsers: agent.id.includes('1')
    }))
  );
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'base' as 'base' | 'admin' | 'owner'
  });

  const [editingUser, setEditingUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'base' | 'admin' | 'owner';
  } | null>(null);

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  
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

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newMockUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...newUser
    };

    setMockUsers([...mockUsers, newMockUser]);
    setNewUser({ name: '', email: '', role: 'base' });
    setUserDialogOpen(false);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`
    });
  };

  const handleEditUser = (user: typeof mockUsers[0]) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'base' | 'admin' | 'owner'
    });
    setEditUserDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    const updatedUsers = mockUsers.map(user => 
      user.id === editingUser.id ? editingUser : user
    );
    
    setMockUsers(updatedUsers);
    setEditUserDialogOpen(false);
    
    toast({
      title: "User Updated",
      description: `${editingUser.name} has been updated successfully.`
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = mockUsers.find(user => user.id === userId);
    if (!userToDelete) return;
    
    if (userToDelete.role === 'owner') {
      toast({
        title: "Cannot Delete Owner",
        description: "Owner accounts cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    setMockUsers(mockUsers.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: "The user has been deleted successfully."
    });
  };

  const toggleAgentVisibility = (agentId: string, userType: 'admin' | 'base') => {
    setMockAgentVisibility(prev => prev.map(item => {
      if (item.agentId === agentId) {
        if (userType === 'admin') {
          return { ...item, visibleToAdmins: !item.visibleToAdmins };
        } else {
          return { ...item, visibleToBaseUsers: !item.visibleToBaseUsers };
        }
      }
      return item;
    }));
    
    toast({
      title: "Visibility Updated",
      description: "Agent visibility has been updated successfully."
    });
  };

  if (!isAdmin()) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

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
              {isOwner() && (
                <AdminNavItem
                  icon={<Eye className="w-5 h-5" />}
                  label="Agent Visibility"
                  active={activeTab === 'agent-visibility'}
                  onClick={() => setActiveTab('agent-visibility')}
                />
              )}
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">User Management</h2>
                  {isOwner() && (
                    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="action" className="flex items-center gap-2">
                          <PlusCircle className="w-4 h-4" />
                          <span>Add User</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                              id="name" 
                              value={newUser.name} 
                              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={newUser.email} 
                              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                              placeholder="john@example.com"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select 
                              value={newUser.role} 
                              onValueChange={(value: 'base' | 'admin' | 'owner') => setNewUser({...newUser, role: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="base">Base User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="action" onClick={handleAddUser}>
                            Add User
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        {isOwner() && (
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'owner' 
                                ? 'bg-purple-100 text-purple-800' 
                                : user.role === 'admin' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role === 'base' ? 'Base User' : user.role === 'admin' ? 'Admin' : 'Owner'}
                            </span>
                          </td>
                          {isOwner() && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditUser(user)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Name</Label>
                          <Input 
                            id="edit-name" 
                            value={editingUser.name} 
                            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-email">Email</Label>
                          <Input 
                            id="edit-email" 
                            value={editingUser.email}
                            readOnly 
                            className="bg-gray-100 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500">Email addresses cannot be changed</p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-role">Role</Label>
                          <Select 
                            value={editingUser.role} 
                            onValueChange={(value: 'base' | 'admin' | 'owner') => setEditingUser({...editingUser, role: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="base">Base User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="owner">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="action" onClick={handleUpdateUser}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            
            {activeTab === 'agent-visibility' && isOwner() && (
              <div>
                <h2 className="text-xl font-bold mb-6">Agent Visibility Settings</h2>
                <p className="text-gray-600 mb-4">
                  Configure which agents are visible to different user types.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agent Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visible to Admins
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visible to Base Users
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockAgentVisibility.map((agent) => (
                        <tr key={agent.agentId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Switch 
                              checked={agent.visibleToAdmins}
                              onCheckedChange={() => toggleAgentVisibility(agent.agentId, 'admin')}
                              className="ml-auto"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Switch 
                              checked={agent.visibleToBaseUsers}
                              onCheckedChange={() => toggleAgentVisibility(agent.agentId, 'base')}
                              className="ml-auto"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'permissions' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Permission Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium mb-4">Role Permissions</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Base User</h4>
                        <ul className="list-disc pl-5 text-gray-600 text-sm">
                          <li>Access to Home Dashboard</li>
                          <li>Access to assigned Agents</li>
                          <li>Access to Session Logs</li>
                          <li>Edit Personal Profile</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Admin</h4>
                        <ul className="list-disc pl-5 text-gray-600 text-sm">
                          <li>All Base User permissions</li>
                          <li>View Services and LLM</li>
                          <li>Access to Admin Panel</li>
                          <li>Modify Agent settings</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Owner</h4>
                        <ul className="list-disc pl-5 text-gray-600 text-sm">
                          <li>All Admin permissions</li>
                          <li>Add/Edit/Delete Services and LLM</li>
                          <li>Add/Edit/Delete users</li>
                          <li>Configure agent visibility</li>
                          <li>Full system access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
