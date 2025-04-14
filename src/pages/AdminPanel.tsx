
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { User, Lock, Image, Palette, Database, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const AdminPanel: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  const { toast } = useToast();

  if (!isAdmin()) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access the admin panel. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <Tabs defaultValue="users">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="users" className="rounded-md">
            <User className="w-4 h-4 mr-2" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-md">
            <Lock className="w-4 h-4 mr-2" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-md">
            <Palette className="w-4 h-4 mr-2" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="rounded-md">
            <Database className="w-4 h-4 mr-2" />
            <span>Database</span>
          </TabsTrigger>
          {isOwner() && (
            <TabsTrigger value="permissions" className="rounded-md">
              <Shield className="w-4 h-4 mr-2" />
              <span>Permissions</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-600 mb-6">
              Manage users, roles and permissions for the platform. Only owner accounts can create new admin users.
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                      <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-900">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                      <td className="px-6 py-4 whitespace-nowrap">jane@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">Base</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-900">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {isOwner() && (
              <div className="mt-8">
                <Button className="bg-action-primary hover:bg-opacity-90">
                  Add New User
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
            <p className="text-gray-600 mb-6">
              Customize the look and feel of the platform with colors, logo, and branding options.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Logo</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <Image className="mx-auto w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop your logo here, or click to select a file.
                    Recommended size: 200x200px
                  </p>
                  <Button variant="outline">Upload Logo</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Brand Colors</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-action-primary mr-3"></div>
                      <Input type="text" value="#1A1562" className="w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 mr-3"></div>
                      <Input type="text" value="#4071FF" className="w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-green-500 mr-3"></div>
                      <Input type="text" value="#3CAF85" className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Platform Name</h3>
              <div className="mb-6">
                <Input type="text" value="ACTION" className="w-full max-w-md" />
                <p className="text-sm text-gray-500 mt-1">
                  This will be displayed in the navigation bar and browser title.
                </p>
              </div>
              <div>
                <Input type="text" value="Powered by BlueSky" className="w-full max-w-md" />
                <p className="text-sm text-gray-500 mt-1">
                  This will appear below the platform name.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button className="bg-action-primary hover:bg-opacity-90" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <p className="text-gray-600 mb-6">
              Configure security options for the platform.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Password Policy</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input type="checkbox" id="min-length" className="mr-2" checked />
                  <label htmlFor="min-length" className="text-gray-700">
                    Require minimum password length of 8 characters
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="special-chars" className="mr-2" checked />
                  <label htmlFor="special-chars" className="text-gray-700">
                    Require at least one special character
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="upper-lower" className="mr-2" checked />
                  <label htmlFor="upper-lower" className="text-gray-700">
                    Require both upper and lower case letters
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="numbers" className="mr-2" checked />
                  <label htmlFor="numbers" className="text-gray-700">
                    Require at least one number
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Session Settings</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <Input type="number" value="60" className="w-full max-w-xs" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="force-logout" className="mr-2" checked />
                <label htmlFor="force-logout" className="text-gray-700">
                  Force logout on browser close
                </label>
              </div>
            </div>

            <div className="mt-8">
              <Button className="bg-action-primary hover:bg-opacity-90" onClick={handleSave}>
                Save Security Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Database Configuration</h2>
            <p className="text-gray-600 mb-6">
              Configure database connections and settings for the platform.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Database Connection</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Database Type
                  </label>
                  <select className="w-full max-w-md border border-gray-300 rounded-md shadow-sm p-2">
                    <option>PostgreSQL</option>
                    <option>MySQL</option>
                    <option>MongoDB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Host
                  </label>
                  <Input type="text" value="localhost" className="w-full max-w-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Port
                  </label>
                  <Input type="text" value="5432" className="w-full max-w-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Database Name
                  </label>
                  <Input type="text" value="action_ai" className="w-full max-w-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input type="text" value="admin" className="w-full max-w-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input type="password" value="********" className="w-full max-w-md" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button className="bg-action-primary hover:bg-opacity-90" onClick={handleSave}>
                Save Configuration
              </Button>
              <Button variant="outline">
                Test Connection
              </Button>
            </div>
          </div>
        </TabsContent>

        {isOwner() && (
          <TabsContent value="permissions" className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Permission Management</h2>
              <p className="text-gray-600 mb-6">
                Configure permission settings for different user roles.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Feature
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Base User
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4">View Agents</td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Use Agents</td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Modify Agents</td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Create Agents</td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Manage Services</td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Manage LLMs</td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">View Analytics</td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Manage Users</td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">System Configuration</td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked readOnly />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <Button className="bg-action-primary hover:bg-opacity-90" onClick={handleSave}>
                  Save Permissions
                </Button>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminPanel;
