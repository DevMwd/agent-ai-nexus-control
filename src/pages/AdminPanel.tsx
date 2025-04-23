import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { User, Settings, BarChart, Database, Edit, Save, X, Plus, LayoutDashboard, UserPlus, Shield, Cog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const ROLES_OPTIONS = [
  { id: 1, name: 'admin', label: 'Admin' },
  { id: 2, name: 'user', label: 'User' },
  { id: 3, name: 'editor', label: 'Editor' },
];

const PERMISSIONS = [
  { value: 'Full access', label: 'Full access' },
  { value: 'Limited access', label: 'Limited access' },
  { value: 'Content management', label: 'Content management' },
  { value: 'Analytics only', label: 'Analytics only' },
  { value: 'API only', label: 'API only' },
];

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();

  // State User Management
  const [users, setUsers] = useState([
    { id: 1, username: "demo_user", email: "demo@example.com", role: "admin" },
    { id: 2, username: "normal_user", email: "user@example.com", role: "user" }
  ]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({username: '', email: '', role: 'user'});
  const [userSaved, setUserSaved] = useState(false);
  
  // Roles Management
  const [roles, setRoles] = useState([
    { id: 1, name: "admin", permissions: "Full access" },
    { id: 2, name: "user", permissions: "Limited access" },
    { id: 3, name: "editor", permissions: "Content management" }
  ]);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [addingRole, setAddingRole] = useState(false);
  const [newRole, setNewRole] = useState({name: '', permissions: ''});

  // State System Configuration
  const [config, setConfig] = useState({
    siteName: "My AI Platform",
    theme: "light",
    language: "en",
    sessionTimeout: "30",
    maxUploadSize: "5",
    defaultUserRole: "user"
  });
  const [configSaved, setConfigSaved] = useState(false);

  // State Platform Analytics
  const [analytics, setAnalytics] = useState({
    activeUsers: 12,
    apiCalls: 452,
    errorRate: "2%",
    averageResponseTime: "0.8s",
    userGrowth: "15%"
  });
  const [analyticsSaved, setAnalyticsSaved] = useState(false);

  // State API Management
  const [apiConfig, setApiConfig] = useState({
    apiKey: "sk_test_1234",
    integrations: "Slack, Zapier",
    maxRateLimit: "100",
    authType: "Bearer"
  });
  const [apiSaved, setApiSaved] = useState(false);

  // Modifica handlers utente e ruolo per gestione Select dropdown
  const handleUserRoleSelect = (value: string) => {
    setNewUser({ ...newUser, role: value });
  };
  const handleEditingUserRoleSelect = (value: string) => {
    setEditingUser({ ...editingUser, role: value });
  };
  const handleRolePermissionSelect = (value: string) => {
    setNewRole({ ...newRole, permissions: value });
  };
  const handleEditingRolePermissionSelect = (value: string) => {
    setEditingRole({ ...editingRole, permissions: value });
  };

  // User Management handlers
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    setUserSaved(false);
  };
  
  const handleUserEdit = (user: any) => {
    setEditingUser(user);
    setUserSaved(false);
  };
  
  const handleUserSave = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    setUserSaved(true);
    toast({
      title: "User Updated",
      description: "User information has been updated successfully.",
    });
  };
  
  const handleUserCancel = () => {
    setEditingUser(null);
  };
  
  const handleUserAdd = () => {
    setAddingUser(true);
    setNewUser({username: '', email: '', role: 'user'});
  };
  
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({...newUser, [e.target.name]: e.target.value});
  };
  
  const handleUserCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...users.map(u=>u.id)) + 1;
    setUsers([...users, { ...newUser, id: newId }]);
    setAddingUser(false);
    toast({
      title: "User Created",
      description: `New user "${newUser.username}" has been created successfully.`,
    });
  };
  
  const handleUserAddCancel = () => setAddingUser(false);

  // Role Management handlers
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingRole({ ...editingRole, [e.target.name]: e.target.value });
  };
  
  const handleRoleEdit = (role: any) => {
    setEditingRole(role);
  };
  
  const handleRoleSave = () => {
    setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
    setEditingRole(null);
    toast({
      title: "Role Updated",
      description: "Role has been updated successfully.",
    });
  };
  
  const handleRoleCancel = () => {
    setEditingRole(null);
  };
  
  const handleRoleAdd = () => {
    setAddingRole(true);
    setNewRole({name: '', permissions: ''});
  };
  
  const handleNewRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRole({...newRole, [e.target.name]: e.target.value});
  };
  
  const handleRoleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...roles.map(r=>r.id)) + 1;
    setRoles([...roles, { ...newRole, id: newId }]);
    setAddingRole(false);
    toast({
      title: "Role Created",
      description: `New role "${newRole.name}" has been created successfully.`,
    });
  };
  
  const handleRoleAddCancel = () => setAddingRole(false);

  // System Config handlers
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
    setConfigSaved(false);
  };
  
  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSaved(true);
    toast({
      title: "Configuration Saved",
      description: "System configuration has been updated successfully.",
    });
  };

  // Analytics handlers
  const handleAnalyticsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnalytics({ ...analytics, [e.target.name]: e.target.value });
    setAnalyticsSaved(false);
  };
  
  const handleAnalyticsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyticsSaved(true);
    toast({
      title: "Analytics Updated",
      description: "Platform analytics have been updated successfully.",
    });
  };

  // API Management handlers
  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiConfig({ ...apiConfig, [e.target.name]: e.target.value });
    setApiSaved(false);
  };
  
  const handleApiSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiSaved(true);
    toast({
      title: "API Settings Saved",
      description: "API configuration has been updated successfully.",
    });
  };

  if (!isAdmin()) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-3 md:px-0" style={{background: 'linear-gradient(109.6deg, #DFEAF7 11.2%, #F4F8FC 91.1%)'}}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-9 h-9 text-blue-700" />
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-500 text-transparent bg-clip-text drop-shadow">
            Admin Panel
          </h1>
        </div>
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-0">
            <CardTitle className="flex gap-2 items-center text-2xl mb-1">
              <Badge variant="outline" className="bg-blue-100 text-blue-700">Admin Control Center</Badge>
            </CardTitle>
            <CardDescription>Gestisci tutti gli aspetti della piattaforma da questa dashboard strutturata.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-3 px-2 flex bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-lg shadow-inner">
                <TabsTrigger value="users" className="flex items-center gap-2"><User size={18}/> User Management</TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2"><Shield size={18}/> Role Management</TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2"><Settings size={18}/> System Config</TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2"><BarChart size={18}/> Analytics</TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2"><Database size={18}/> API</TabsTrigger>
              </TabsList>
              
              {/* User Management */}
              <TabsContent value="users">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* CREATE USER */}
                  <section className="bg-blue-50 border rounded-xl shadow p-6 flex flex-col">
                    <div className="flex gap-2 items-center mb-2">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-extrabold tracking-tight text-blue-700">Crea nuovo utente</h2>
                    </div>
                    <form onSubmit={handleUserCreate} className="flex flex-col gap-3 mt-2">
                      <Input required name="username" placeholder="Username" value={newUser.username} onChange={handleNewUserChange} autoComplete="off" />
                      <Input required type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleNewUserChange} autoComplete="off" />
                      <Select value={newUser.role} onValueChange={handleUserRoleSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Ruolo utente" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES_OPTIONS.map(opt => (
                            <SelectItem value={opt.name} key={opt.id}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 items-center justify-end mt-3">
                        <Button type="submit" variant="action" size="sm"><Save size={16}/> Crea</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleUserAddCancel}><X size={16}/>Reset</Button>
                      </div>
                    </form>
                  </section>
                  {/* USERS TABLE + EDIT */}
                  <section className="bg-white border rounded-xl shadow p-6">
                    <div className="flex gap-2 items-center mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-extrabold tracking-tight text-blue-700">Utenti registrati</h2>
                    </div>
                    <div className="overflow-x-auto rounded-xl">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Ruolo</TableHead>
                            <TableHead>Azioni</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map(user =>
                            editingUser && editingUser.id === user.id ? (
                              <TableRow key={user.id} className="bg-blue-50/60">
                                <TableCell>
                                  <Input name="username" className="rounded" value={editingUser.username} onChange={handleUserChange} />
                                </TableCell>
                                <TableCell>
                                  <Input name="email" className="rounded" value={editingUser.email} onChange={handleUserChange} />
                                </TableCell>
                                <TableCell>
                                  <Select value={editingUser.role} onValueChange={handleEditingUserRoleSelect}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Ruolo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {ROLES_OPTIONS.map(opt => (
                                        <SelectItem value={opt.name} key={opt.id}>{opt.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={handleUserSave}><Save size={16}/></Button>
                                  <Button variant="outline" size="sm" onClick={handleUserCancel}><X size={16}/></Button>
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow key={user.id} className="hover:bg-blue-50/40">
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">{user.role}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" onClick={() => handleUserEdit(user)}>
                                    <Edit size={16} className="mr-1"/> Modifica
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </section>
                </div>
              </TabsContent>

              {/* Role Management */}
              <TabsContent value="roles">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* CREA RUOLO */}
                  <section className="bg-purple-50 border rounded-xl shadow p-6 flex flex-col">
                    <div className="flex gap-2 items-center mb-2">
                      <Plus className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-lg font-extrabold tracking-tight text-indigo-800">Crea nuovo ruolo</h2>
                    </div>
                    <form onSubmit={handleRoleCreate} className="flex flex-col gap-3 mt-2">
                      <Input required name="name" placeholder="Nome ruolo" value={newRole.name} onChange={handleNewRoleChange} autoComplete="off" />
                      <Select value={newRole.permissions} onValueChange={handleRolePermissionSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo di permessi" />
                        </SelectTrigger>
                        <SelectContent>
                          {PERMISSIONS.map(opt => (
                            <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 items-center justify-end mt-3">
                        <Button type="submit" variant="action" size="sm"><Save size={16}/> Crea</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleRoleAddCancel}><X size={16}/>Reset</Button>
                      </div>
                    </form>
                  </section>
                  {/* RUOLI TABLE + EDIT */}
                  <section className="bg-white border rounded-xl shadow p-6">
                    <div className="flex gap-2 items-center mb-2">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-lg font-extrabold tracking-tight text-indigo-800">Ruoli disponibili</h2>
                    </div>
                    <div className="overflow-x-auto rounded-xl">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ruolo</TableHead>
                            <TableHead>Permessi</TableHead>
                            <TableHead>Azioni</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {roles.map(role =>
                            editingRole && editingRole.id === role.id ? (
                              <TableRow key={role.id} className="bg-indigo-50/60">
                                <TableCell>
                                  <Input name="name" className="rounded" value={editingRole.name} onChange={handleRoleChange} />
                                </TableCell>
                                <TableCell>
                                  <Select value={editingRole.permissions} onValueChange={handleEditingRolePermissionSelect}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Permessi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {PERMISSIONS.map(opt => (
                                        <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={handleRoleSave}><Save size={16}/></Button>
                                  <Button variant="outline" size="sm" onClick={handleRoleCancel}><X size={16}/></Button>
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow key={role.id} className="hover:bg-indigo-50/40">
                                <TableCell>{role.name}</TableCell>
                                <TableCell>{role.permissions}</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" onClick={() => handleRoleEdit(role)}>
                                    <Edit size={16} className="mr-1"/> Modifica
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </section>
                </div>
              </TabsContent>

              {/* SYSTEM CONFIG */}
              <TabsContent value="system">
                <div className="flex gap-2 items-center mb-2">
                  <Settings className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-extrabold tracking-tight">System Configuration</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2">Setup</Badge>
                </div>
                <div className="text-gray-500 mt-1 mb-6">Configure main platform parameters easily.</div>
                
                <form onSubmit={handleConfigSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-6 bg-blue-50 border rounded-xl shadow mb-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input id="siteName" name="siteName" value={config.siteName} onChange={handleConfigChange} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Input id="theme" name="theme" value={config.theme} onChange={handleConfigChange} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Input id="language" name="language" value={config.language} onChange={handleConfigChange} className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input id="sessionTimeout" name="sessionTimeout" value={config.sessionTimeout} onChange={handleConfigChange} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                      <Input id="maxUploadSize" name="maxUploadSize" value={config.maxUploadSize} onChange={handleConfigChange} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="defaultUserRole">Default User Role</Label>
                      <Input id="defaultUserRole" name="defaultUserRole" value={config.defaultUserRole} onChange={handleConfigChange} className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 mt-2">
                    <Button type="submit" variant="action">
                      <Save className="inline mb-1 mr-1" /> Save Configuration
                    </Button>
                  </div>
                </form>
                
                {configSaved && <span className="mt-2 text-green-600 text-sm font-semibold">Configuration saved!</span>}
              </TabsContent>

              {/* ANALYTICS */}
              <TabsContent value="analytics">
                <div className="flex gap-2 items-center mb-2">
                  <BarChart className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-extrabold tracking-tight">Platform Analytics</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2">Analytics</Badge>
                </div>
                <div className="text-gray-500 mt-1 mb-6">View and update platform usage statistics.</div>
                
                <form onSubmit={handleAnalyticsSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-6 bg-blue-50 border rounded-xl shadow mb-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="activeUsers">Active Users</Label>
                      <Input id="activeUsers" name="activeUsers" value={analytics.activeUsers} onChange={handleAnalyticsChange} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="apiCalls">API Calls</Label>
                      <Input id="apiCalls" name="apiCalls" value={analytics.apiCalls} onChange={handleAnalyticsChange} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="errorRate">Error Rate</Label>
                      <Input id="errorRate" name="errorRate" value={analytics.errorRate} onChange={handleAnalyticsChange} className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="averageResponseTime">Average Response Time</Label>
                      <Input id="averageResponseTime" name="averageResponseTime" value={analytics.averageResponseTime} onChange={handleAnalyticsChange} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="userGrowth">User Growth (monthly)</Label>
                      <Input id="userGrowth" name="userGrowth" value={analytics.userGrowth} onChange={handleAnalyticsChange} className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 mt-2">
                    <Button type="submit" variant="action">
                      <Save className="inline mb-1 mr-1" /> Update Analytics
                    </Button>
                  </div>
                </form>
                
                {analyticsSaved && <span className="mt-2 text-green-600 text-sm font-semibold">Analytics updated!</span>}
              </TabsContent>

              {/* API MANAGEMENT */}
              <TabsContent value="api">
                <div className="flex gap-2 items-center mb-2">
                  <Database className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-extrabold tracking-tight">API Management</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2">API &amp; Integration</Badge>
                </div>
                <div className="text-gray-500 mt-1 mb-6">Manage API keys and integrations with external services.</div>
                
                <form onSubmit={handleApiSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-6 bg-blue-50 border rounded-xl shadow mb-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input id="apiKey" name="apiKey" value={apiConfig.apiKey} onChange={handleApiChange} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="integrations">Integrations</Label>
                      <Input id="integrations" name="integrations" value={apiConfig.integrations} onChange={handleApiChange} className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="maxRateLimit">Max Rate Limit (requests/min)</Label>
                      <Input id="maxRateLimit" name="maxRateLimit" value={apiConfig.maxRateLimit} onChange={handleApiChange} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="authType">Authentication Type</Label>
                      <Input id="authType" name="authType" value={apiConfig.authType} onChange={handleApiChange} className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 mt-2">
                    <Button type="submit" variant="action">
                      <Save className="inline mb-1 mr-1" /> Save API Settings
                    </Button>
                  </div>
                </form>
                
                {apiSaved && <span className="mt-2 text-green-600 text-sm font-semibold">API settings saved!</span>}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
