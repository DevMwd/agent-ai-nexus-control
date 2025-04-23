
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { User, Settings, BarChart, Database, Edit, Save, X, Plus, LayoutDashboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const sectionBG = "bg-gradient-to-br from-white via-[#f8f7fc] to-[#e9f0fa]";

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

  // State System Configuration
  const [config, setConfig] = useState({
    siteName: "My AI Platform",
    theme: "light",
  });
  const [configSaved, setConfigSaved] = useState(false);

  // State Platform Analytics
  const [analytics, setAnalytics] = useState({
    activeUsers: 12,
    apiCalls: 452,
    errorRate: "2%",
  });
  const [analyticsSaved, setAnalyticsSaved] = useState(false);

  // State API Management
  const [apiConfig, setApiConfig] = useState({
    apiKey: "sk_test_1234",
    integrations: "Slack, Zapier"
  });
  const [apiSaved, setApiSaved] = useState(false);

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
    setUsers([...users, { ...newUser, id: Math.max(...users.map(u=>u.id)) + 1 }]);
    setAddingUser(false);
  };
  const handleUserAddCancel = () => setAddingUser(false);

  // System Config handlers
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
    setConfigSaved(false);
  };
  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSaved(true);
  };

  // Analytics handlers
  const handleAnalyticsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnalytics({ ...analytics, [e.target.name]: e.target.value });
    setAnalyticsSaved(false);
  };
  const handleAnalyticsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyticsSaved(true);
  };

  // API Management handlers
  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiConfig({ ...apiConfig, [e.target.name]: e.target.value });
    setApiSaved(false);
  };
  const handleApiSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiSaved(true);
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
          <LayoutDashboard className="w-9 h-9 text-violet-700" />
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-indigo-700 via-purple-500 to-pink-400 text-transparent bg-clip-text drop-shadow">Admin Panel</h1>
        </div>
        <Card className={"shadow-xl border-0"}>
          <CardHeader className="pb-0">
            <CardTitle className="flex gap-2 items-center text-2xl mb-1">
              <Badge variant="outline" className="bg-indigo-100 text-indigo-700">Admin Control Center</Badge>
            </CardTitle>
            <CardDescription>Gestisci ogni aspetto della piattaforma da un'unica dashboard, in modo semplice e moderno.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-3 px-2 flex bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-lg shadow-inner">
                <TabsTrigger value="users" className="flex items-center gap-2"><User size={18}/> User Management</TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2"><Settings size={18}/> System Config</TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2"><BarChart size={18}/> Analytics</TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2"><Database size={18}/> API</TabsTrigger>
              </TabsList>
              {/* User Management */}
              <TabsContent value="users">
                <div className="md:flex md:items-center md:justify-between mb-6">
                  <div>
                    <div className="flex gap-2 items-center">
                      <User className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-xl font-extrabold tracking-tight">User Management</h2>
                      <Badge variant="secondary" className="bg-indigo-200 text-indigo-900 ml-2">Gestione</Badge>
                    </div>
                    <div className="text-gray-500 mt-1 mb-3">Gestisci accounts, ruoli e permessi sulla piattaforma. Edita, aggiungi e aggiorna gli utenti.</div>
                  </div>
                  {!addingUser && (
                    <Button variant="action" size="sm" onClick={handleUserAdd} className="mt-3 md:mt-0">
                      <Plus className="w-4 h-4 mr-1" /> New user
                    </Button>
                  )}
                </div>
                {addingUser && (
                  <form onSubmit={handleUserCreate} className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2 p-4 rounded-lg bg-indigo-50 border">
                    <Input required name="username" placeholder="Username" value={newUser.username} onChange={handleNewUserChange} />
                    <Input required name="email" placeholder="Email" value={newUser.email} onChange={handleNewUserChange} />
                    <Input name="role" placeholder="Role" value={newUser.role} onChange={handleNewUserChange} />
                    <div className="flex gap-1 items-center justify-end">
                      <Button type="submit" variant="outline" size="sm" ><Save size={16}/></Button>
                      <Button type="button" variant="outline" size="sm" onClick={handleUserAddCancel}><X size={16}/></Button>
                    </div>
                  </form>
                )}
                <div className="overflow-x-auto rounded-2xl border shadow bg-white/95">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(user =>
                        editingUser && editingUser.id === user.id ? (
                          <TableRow key={user.id} className="bg-indigo-50/60">
                            <TableCell>
                              <Input name="username" className="rounded" value={editingUser.username} onChange={handleUserChange} />
                            </TableCell>
                            <TableCell>
                              <Input name="email" className="rounded" value={editingUser.email} onChange={handleUserChange} />
                            </TableCell>
                            <TableCell>
                              <Input name="role" className="rounded" value={editingUser.role} onChange={handleUserChange} />
                            </TableCell>
                            <TableCell className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={handleUserSave}><Save size={16}/></Button>
                              <Button variant="outline" size="sm" onClick={handleUserCancel}><X size={16}/></Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow key={user.id} className="hover:bg-purple-50/40">
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell><Badge variant="outline" className="bg-indigo-50 text-indigo-700">{user.role}</Badge></TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => handleUserEdit(user)}>
                                <Edit size={16} className="mr-1"/> Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
                {userSaved && <span className="text-green-600 text-sm font-semibold mt-2 inline-block">User info salvata!</span>}
              </TabsContent>

              {/* SYSTEM CONFIG */}
              <TabsContent value="system">
                <div className="flex gap-2 items-center mb-2">
                  <Settings className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-extrabold tracking-tight">System Configuration</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-900 ml-2">Setup</Badge>
                </div>
                <div className="text-gray-500 mt-1 mb-6">Configura facilmente parametri principali della piattaforma.</div>
                <form onSubmit={handleConfigSave} className="flex flex-col md:flex-row gap-5 items-end py-4 px-2 bg-blue-50 border rounded-xl shadow mb-4">
                  <div className="flex-1">
                    <label htmlFor="siteName" className="block font-medium mb-1">Site Name</label>
                    <Input id="siteName" name="siteName" value={config.siteName} onChange={handleConfigChange} />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="theme" className="block font-medium mb-1">Theme</label>
                    <Input id="theme" name="theme" value={config.theme} onChange={handleConfigChange} />
                  </div>
                  <div>
                    <Button type="submit" variant="action" className="w-full">
                      <Save className="inline mb-1 mr-1" /> Salva
                    </Button>
                  </div>
                </form>
                {configSaved && <span className="mt-2 text-green-600 text-sm font-semibold">Configurazione salvata!</span>}
              </TabsContent>

              {/* ANALYTICS */}
              <TabsContent value="analytics">
                <div className="flex gap-2 items-center mb-2">
                  <BarChart className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-extrabold tracking-tight">Platform Analytics</h2>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-600 ml-2">Analytics</Badge>
                </div>
                <div className="text-gray-500 mt-1 mb-6">Visualizza e aggiorna le statistiche di utilizzo della piattaforma.</div>
                <form onSubmit={handleAnalyticsSave} className="flex flex-col md:flex-row gap-5 items-end py-4 px-2 bg-pink-50 border rounded-xl shadow mb-4">
                  <div className="flex-1">
                    <label htmlFor="activeUsers" className="block font-medium mb-1">Active Users</label>
                    <Input id="activeUsers" name="activeUsers" value={analytics.activeUsers} onChange={handleAnalyticsChange} />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="apiCalls" className="block font-medium mb-1">API Calls</label>
                    <Input id="apiCalls" name="apiCalls" value={analytics.apiCalls} onChange={handleAnalyticsChange} />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="errorRate" className="block font-medium mb-1">Error Rate</label>
                    <Input id="errorRate" name="errorRate" value={analytics.errorRate} onChange={handleAnalyticsChange} />
                  </div>
                  <div>
                    <Button type="submit" variant="action" className="w-full">
                      <Save className="inline mb-1 mr-1" /> Salva
                    </Button>
                  </div>
                </form>
                {analyticsSaved && <span className="mt-2 text-green-600 text-sm font-semibold">Analytics salvate!</span>}
              </TabsContent>

              {/* API MANAGEMENT */}
              <TabsContent value="api">
                <div className="flex gap-2 items-center mb-2">
                  <Database className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-extrabold tracking-tight">API Management</h2>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">API &amp; Integration</Badge>
                </div>
                <div className="text-gray-500 mt-1 mb-6">Gestisci le API key e le integrazioni con altri servizi esterni dalla piattaforma.</div>
                <form onSubmit={handleApiSave} className="flex flex-col md:flex-row gap-5 items-end py-4 px-2 bg-green-50 border rounded-xl shadow mb-4">
                  <div className="flex-1">
                    <label htmlFor="apiKey" className="block font-medium mb-1">API Key</label>
                    <Input id="apiKey" name="apiKey" value={apiConfig.apiKey} onChange={handleApiChange} />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="integrations" className="block font-medium mb-1">Integrations</label>
                    <Input id="integrations" name="integrations" value={apiConfig.integrations} onChange={handleApiChange} />
                  </div>
                  <div>
                    <Button type="submit" variant="action" className="w-full">
                      <Save className="inline mb-1 mr-1" /> Salva
                    </Button>
                  </div>
                </form>
                {apiSaved && <span className="mt-2 text-green-600 text-sm font-semibold">API settings salvate!</span>}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;

