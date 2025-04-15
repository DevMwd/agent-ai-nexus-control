import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Settings, 
  Palette, 
  Shield, 
  BellRing, 
  Upload, 
  PlusCircle, 
  Edit, 
  Trash, 
  Eye, 
  EyeOff, 
  Building,
  Link as LinkIcon,
  Search,
  Filter
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth, Organization } from '@/contexts/AuthContext';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId?: string;
  organizationName?: string;
  profileImage?: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { isAdmin, isOwner, user } = useAuth();
  const { agents } = useAgents();
  
  const [mockUsers, setMockUsers] = useState<MockUser[]>([
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', organizationId: '1', organizationName: 'MWD' },
    { id: '2', name: 'Base User', email: 'user@example.com', role: 'base', organizationId: '1', organizationName: 'MWD' },
    { id: '3', name: 'Owner User', email: 'owner@example.com', role: 'owner', profileImage: '/lovable-uploads/695db59c-0b86-4a3f-afbe-6cf313ac93e5.png' }
  ]);

  const [mockOrganizations, setMockOrganizations] = useState<Organization[]>([
    { id: '1', name: 'MWD', description: 'Digital Transformation Agency', createdAt: '2023-04-15T10:00:00Z' },
    { id: '2', name: 'Acme Corp', description: 'Technology Solutions Provider', createdAt: '2023-05-20T14:30:00Z' }
  ]);

  const [mockAgentVisibility, setMockAgentVisibility] = useState(
    agents.map(agent => ({
      agentId: agent.id,
      name: agent.title || agent.id,
      visibleToAdmins: true,
      visibleToBaseUsers: agent.id.includes('1'),
      visibleToOrganizations: [{ id: '1', name: 'MWD' }]
    }))
  );
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'base' as 'base' | 'admin' | 'owner',
    organizationId: ''
  });

  const [editingUser, setEditingUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'base' | 'admin' | 'owner';
    organizationId?: string;
  } | null>(null);

  const [newOrganization, setNewOrganization] = useState({
    name: '',
    description: ''
  });

  const [editingOrganization, setEditingOrganization] = useState<{
    id: string;
    name: string;
    description?: string;
  } | null>(null);

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [organizationDialogOpen, setOrganizationDialogOpen] = useState(false);
  const [editOrganizationDialogOpen, setEditOrganizationDialogOpen] = useState(false);
  const [organizationAgentDialogOpen, setOrganizationAgentDialogOpen] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
  const [selectedOrganizationName, setSelectedOrganizationName] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [filteredAgents, setFilteredAgents] = useState(mockAgentVisibility);
  
  useEffect(() => {
    if (agentFilter.trim() === '') {
      setFilteredAgents(mockAgentVisibility);
    } else {
      const filtered = mockAgentVisibility.filter(agent => 
        agent.name.toLowerCase().includes(agentFilter.toLowerCase())
      );
      setFilteredAgents(filtered);
    }
  }, [agentFilter, mockAgentVisibility]);
  
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

    if ((newUser.role === 'base' || newUser.role === 'admin') && !newUser.organizationId) {
      toast({
        title: "Error",
        description: "Please select an organization for this user.",
        variant: "destructive"
      });
      return;
    }

    const organization = newUser.organizationId 
      ? mockOrganizations.find(org => org.id === newUser.organizationId) 
      : undefined;

    const newMockUser: MockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      ...(newUser.organizationId && { organizationId: newUser.organizationId }),
      ...(organization && { organizationName: organization.name })
    };

    setMockUsers([...mockUsers, newMockUser]);
    setNewUser({ name: '', email: '', role: 'base', organizationId: '' });
    setUserDialogOpen(false);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`
    });
  };

  const handleEditUser = (user: MockUser) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'base' | 'admin' | 'owner',
      organizationId: user.organizationId
    });
    setEditUserDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    if ((editingUser.role === 'base' || editingUser.role === 'admin') && !editingUser.organizationId) {
      toast({
        title: "Error",
        description: "Please select an organization for this user.",
        variant: "destructive"
      });
      return;
    }

    const organization = editingUser.organizationId 
      ? mockOrganizations.find(org => org.id === editingUser.organizationId) 
      : undefined;

    const updatedUsers = mockUsers.map(user => 
      user.id === editingUser.id 
        ? { 
            ...user,
            name: editingUser.name,
            role: editingUser.role,
            ...(editingUser.organizationId && { organizationId: editingUser.organizationId }),
            organizationName: organization?.name 
          } 
        : user
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

  const handleAddOrganization = () => {
    if (!newOrganization.name) {
      toast({
        title: "Error",
        description: "Please enter an organization name.",
        variant: "destructive"
      });
      return;
    }

    const newOrg = {
      id: Math.random().toString(36).substr(2, 9),
      name: newOrganization.name,
      description: newOrganization.description,
      createdAt: new Date().toISOString()
    };

    setMockOrganizations([...mockOrganizations, newOrg]);
    setNewOrganization({ name: '', description: '' });
    setOrganizationDialogOpen(false);
    
    toast({
      title: "Organization Added",
      description: `${newOrganization.name} has been added successfully.`
    });
  };

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization({
      id: organization.id,
      name: organization.name,
      description: organization.description
    });
    setEditOrganizationDialogOpen(true);
  };

  const handleUpdateOrganization = () => {
    if (!editingOrganization) return;
    
    if (!editingOrganization.name) {
      toast({
        title: "Error",
        description: "Please enter an organization name.",
        variant: "destructive"
      });
      return;
    }

    const updatedOrganizations = mockOrganizations.map(org => 
      org.id === editingOrganization.id 
        ? { 
            ...org,
            name: editingOrganization.name,
            description: editingOrganization.description
          } 
        : org
    );
    
    const updatedUsers = mockUsers.map(user => 
      user.organizationId === editingOrganization.id 
        ? { ...user, organizationName: editingOrganization.name }
        : user
    );
    
    setMockOrganizations(updatedOrganizations);
    setMockUsers(updatedUsers);
    setEditOrganizationDialogOpen(false);
    
    toast({
      title: "Organization Updated",
      description: `${editingOrganization.name} has been updated successfully.`
    });
  };

  const handleDeleteOrganization = (organizationId: string) => {
    const associatedUsers = mockUsers.filter(user => user.organizationId === organizationId);
    if (associatedUsers.length > 0) {
      toast({
        title: "Cannot Delete Organization",
        description: "There are users associated with this organization. Please reassign or delete those users first.",
        variant: "destructive"
      });
      return;
    }
    
    setMockOrganizations(mockOrganizations.filter(org => org.id !== organizationId));
    
    toast({
      title: "Organization Deleted",
      description: "The organization has been deleted successfully."
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

  const toggleOrganizationAgentVisibility = (agentId: string, organizationId: string) => {
    setMockAgentVisibility(prev => prev.map(item => {
      if (item.agentId === agentId) {
        const orgExists = item.visibleToOrganizations.some(org => org.id === organizationId);
        const organization = mockOrganizations.find(org => org.id === organizationId);
        
        if (!organization) return item;
        
        if (orgExists) {
          return {
            ...item,
            visibleToOrganizations: item.visibleToOrganizations.filter(org => org.id !== organizationId)
          };
        } else {
          return {
            ...item,
            visibleToOrganizations: [...item.visibleToOrganizations, { id: organizationId, name: organization.name }]
          };
        }
      }
      return item;
    }));
    
    toast({
      title: "Organization Visibility Updated",
      description: "Agent visibility for organization has been updated successfully."
    });
  };

  const handleManageOrganizationAgents = (organizationId: string, organizationName: string) => {
    setSelectedOrganizationId(organizationId);
    setSelectedOrganizationName(organizationName);
    setAgentFilter('');
    setOrganizationAgentDialogOpen(true);
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
                  icon={<Building className="w-5 h-5" />}
                  label="Organizations"
                  active={activeTab === 'organizations'}
                  onClick={() => setActiveTab('organizations')}
                />
              )}
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
                          {(newUser.role === 'base' || newUser.role === 'admin') && (
                            <div className="grid gap-2">
                              <Label htmlFor="organization">Organization</Label>
                              <Select 
                                value={newUser.organizationId} 
                                onValueChange={(value) => setNewUser({...newUser, organizationId: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an organization" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockOrganizations.map(org => (
                                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
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
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organization
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
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={user.profileImage} alt={user.name} />
                                <AvatarFallback className="bg-indigo-200 text-indigo-900">
                                  {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.organizationName || 'N/A'}
                            </div>
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
                        {(editingUser.role === 'base' || editingUser.role === 'admin') && (
                          <div className="grid gap-2">
                            <Label htmlFor="edit-organization">Organization</Label>
                            <Select 
                              value={editingUser.organizationId || ''} 
                              onValueChange={(value) => setEditingUser({...editingUser, organizationId: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select an organization" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockOrganizations.map(org => (
                                  <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
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
            
            {activeTab === 'organizations' && isOwner() && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Organizations</h2>
                  <Dialog open={organizationDialogOpen} onOpenChange={setOrganizationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="action" className="flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Organization</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Organization</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="org-name">Organization Name</Label>
                          <Input 
                            id="org-name" 
                            value={newOrganization.name} 
                            onChange={(e) => setNewOrganization({...newOrganization, name: e.target.value})}
                            placeholder="Acme Inc."
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="org-description">Description (Optional)</Label>
                          <Input 
                            id="org-description" 
                            value={newOrganization.description} 
                            onChange={(e) => setNewOrganization({...newOrganization, description: e.target.value})}
                            placeholder="A brief description of the organization"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOrganizationDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="action" onClick={handleAddOrganization}>
                          Add Organization
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Users
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agent Access
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockOrganizations.map((org) => {
                        const orgUsers = mockUsers.filter(user => user.organizationId === org.id);
                        const visibleAgentsCount = mockAgentVisibility.filter(agent => 
                          agent.visibleToOrganizations.some(orgItem => orgItem.id === org.id)
                        ).length;
                        
                        return (
                          <tr key={org.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{org.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{org.description || 'No description'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{orgUsers.length} users</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <Badge variant="outline" className="text-sm">
                                {visibleAgentsCount} agents
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleManageOrganizationAgents(org.id, org.name)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Manage Agent Access"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditOrganization(org)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteOrganization(org.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <Dialog open={editOrganizationDialogOpen} onOpenChange={setEditOrganizationDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Organization</DialogTitle>
                    </DialogHeader>
                    {editingOrganization && (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-org-name">Organization Name</Label>
                          <Input 
                            id="edit-org-name" 
                            value={editingOrganization.name} 
                            onChange={(e) => setEditingOrganization({...editingOrganization, name: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-org-description">Description (Optional)</Label>
                          <Input 
                            id="edit-org-description" 
                            value={editingOrganization.description || ''} 
                            onChange={(e) => setEditingOrganization({...editingOrganization, description: e.target.value})}
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditOrganizationDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="action" onClick={handleUpdateOrganization}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={organizationAgentDialogOpen} onOpenChange={setOrganizationAgentDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        Agent Access for {selectedOrganizationName}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Search className="w-4 h-4 text-gray-500" />
                        <Input 
                          placeholder="Filter agents..." 
                          value={agentFilter}
                          onChange={(e) => setAgentFilter(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {filteredAgents.length > 0 ? (
                          filteredAgents.map(agent => {
                            const isVisible = agent.visibleToOrganizations.some(
                              org => org.id === selectedOrganizationId
                            );
                            return (
                              <div key={agent.agentId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{agent.name}</span>
                                  <span className="text-xs text-gray-500">ID: {agent.agentId}</span>
                                </div>
                                <Switch 
                                  checked={isVisible}
                                  onCheckedChange={() => toggleOrganizationAgentVisibility(agent.agentId, selectedOrganizationId)}
                                />
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No agents found matching your filter
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOrganizationAgentDialogOpen(false)}>
                        Close
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
                  Configure which agents are visible to different user types and organizations.
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organizations
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
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 flex flex-wrap gap-1">
                              {agent.visibleToOrganizations.length > 0 ? (
                                agent.visibleToOrganizations.map(org => (
                                  <span 
                                    key={org.id} 
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    {org.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500 text-xs">No organizations</span>
                              )}
                            </div>
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
