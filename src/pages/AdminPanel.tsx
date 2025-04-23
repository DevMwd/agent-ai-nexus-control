
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { User, Settings, BarChart, Database } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();

  // State User Management
  const [users, setUsers] = useState([
    { id: 1, username: "demo_user", email: "demo@example.com", role: "admin" },
    { id: 2, username: "normal_user", email: "user@example.com", role: "user" }
  ]);
  const [editingUser, setEditingUser] = useState<any>(null);

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

  // User Management edit handlers
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };
  const handleUserEdit = (user: any) => {
    setEditingUser(user);
  };
  const handleUserSave = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  // System Config handlers
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
    setConfigSaved(false);
  };
  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSaved(true);
    // Placeholder, qui salveresti il config nel backend
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
      <div className="container mx-auto px-6 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 grid gap-8">

      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      {/* User Management */}
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          <User className="w-7 h-7 text-indigo-600" />
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                    <TableRow key={user.id}>
                      <TableCell>
                        <Input name="username" value={editingUser.username} onChange={handleUserChange} />
                      </TableCell>
                      <TableCell>
                        <Input name="email" value={editingUser.email} onChange={handleUserChange} />
                      </TableCell>
                      <TableCell>
                        <Input name="role" value={editingUser.role} onChange={handleUserChange} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={handleUserSave}>Save</Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleUserEdit(user)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          <Settings className="w-7 h-7 text-indigo-600" />
          <div>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Configure system-wide settings and parameters</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConfigSave} className="flex flex-col gap-3 max-w-md">
            <div>
              <label htmlFor="siteName" className="block font-medium mb-1">Site Name</label>
              <Input id="siteName" name="siteName" value={config.siteName} onChange={handleConfigChange} />
            </div>
            <div>
              <label htmlFor="theme" className="block font-medium mb-1">Theme</label>
              <Input id="theme" name="theme" value={config.theme} onChange={handleConfigChange} />
            </div>
            <Button type="submit" className="mt-2 w-fit">Save Configuration</Button>
            {configSaved && <span className="text-green-600 text-sm font-semibold">Configuration saved!</span>}
          </form>
        </CardContent>
      </Card>

      {/* Platform Analytics */}
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          <BarChart className="w-7 h-7 text-indigo-600" />
          <div>
            <CardTitle>Platform Analytics</CardTitle>
            <CardDescription>View and edit platform usage statistics</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyticsSave} className="flex flex-col gap-3 max-w-md">
            <div>
              <label htmlFor="activeUsers" className="block font-medium mb-1">Active Users</label>
              <Input id="activeUsers" name="activeUsers" value={analytics.activeUsers} onChange={handleAnalyticsChange} />
            </div>
            <div>
              <label htmlFor="apiCalls" className="block font-medium mb-1">API Calls</label>
              <Input id="apiCalls" name="apiCalls" value={analytics.apiCalls} onChange={handleAnalyticsChange} />
            </div>
            <div>
              <label htmlFor="errorRate" className="block font-medium mb-1">Error Rate</label>
              <Input id="errorRate" name="errorRate" value={analytics.errorRate} onChange={handleAnalyticsChange} />
            </div>
            <Button type="submit" className="mt-2 w-fit">Save Analytics</Button>
            {analyticsSaved && <span className="text-green-600 text-sm font-semibold">Analytics data saved!</span>}
          </form>
        </CardContent>
      </Card>

      {/* API Management */}
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          <Database className="w-7 h-7 text-indigo-600" />
          <div>
            <CardTitle>API Management</CardTitle>
            <CardDescription>Manage API key & integrations</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleApiSave} className="flex flex-col gap-3 max-w-md">
            <div>
              <label htmlFor="apiKey" className="block font-medium mb-1">API Key</label>
              <Input id="apiKey" name="apiKey" value={apiConfig.apiKey} onChange={handleApiChange} />
            </div>
            <div>
              <label htmlFor="integrations" className="block font-medium mb-1">Integrations</label>
              <Input id="integrations" name="integrations" value={apiConfig.integrations} onChange={handleApiChange} />
            </div>
            <Button type="submit" className="mt-2 w-fit">Save API Settings</Button>
            {apiSaved && <span className="text-green-600 text-sm font-semibold">API settings saved!</span>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
