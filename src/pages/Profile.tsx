
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { User, Key, Bell, Shield, Clock } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <Tabs defaultValue="personal">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="personal" className="rounded-md">
            <User className="w-4 h-4 mr-2" />
            <span>Personal Information</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-md">
            <Key className="w-4 h-4 mr-2" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-md">
            <Bell className="w-4 h-4 mr-2" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-md">
            <Shield className="w-4 h-4 mr-2" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-md">
            <Clock className="w-4 h-4 mr-2" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl mb-4">
                    {name.charAt(0)}
                  </div>
                  <Button variant="outline" className="mb-2">Upload Photo</Button>
                  <p className="text-gray-500 text-sm">
                    JPG, GIF or PNG. Max size 800K
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <Input
                      type="text"
                      value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      readOnly
                      className="w-full bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Joined
                    </label>
                    <Input
                      type="text"
                      value="April 1, 2025"
                      readOnly
                      className="w-full bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <Button className="bg-action-primary hover:bg-opacity-90" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <Input type="password" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <Input type="password" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <Input type="password" className="w-full" />
                  </div>
                  <Button className="bg-action-primary hover:bg-opacity-90">
                    Update Password
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <p className="font-medium">Enhance your account security</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Two-factor authentication adds an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Login Sessions</h3>
                <div className="border rounded-lg divide-y">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Chrome on Windows</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Active now • Rome, Italy
                      </p>
                    </div>
                    <div className="text-green-500 text-sm font-medium">Current</div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Safari on macOS</p>
                      <p className="text-gray-500 text-sm mt-1">
                        2 days ago • Milan, Italy
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      Logout
                    </Button>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Firefox on Android</p>
                      <p className="text-gray-500 text-sm mt-1">
                        5 days ago • Venice, Italy
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Agent Session Completed</p>
                      <p className="text-gray-500 text-sm">
                        Receive an email when an agent session is completed
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 select-none">
                      <input type="checkbox" className="sr-only" id="toggle1" checked />
                      <label
                        htmlFor="toggle1"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span
                          className="bg-white block h-6 w-6 rounded-full transform translate-x-0 transition-transform duration-200"
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cost Alerts</p>
                      <p className="text-gray-500 text-sm">
                        Receive an email when costs exceed your set threshold
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 select-none">
                      <input type="checkbox" className="sr-only" id="toggle2" checked />
                      <label
                        htmlFor="toggle2"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span
                          className="bg-white block h-6 w-6 rounded-full transform translate-x-0 transition-transform duration-200"
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Agent Available</p>
                      <p className="text-gray-500 text-sm">
                        Receive an email when new agents are available
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 select-none">
                      <input type="checkbox" className="sr-only" id="toggle3" />
                      <label
                        htmlFor="toggle3"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span
                          className="bg-white block h-6 w-6 rounded-full transform translate-x-0 transition-transform duration-200"
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">System Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Browser Notifications</p>
                      <p className="text-gray-500 text-sm">
                        Allow browser notifications for important updates
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 select-none">
                      <input type="checkbox" className="sr-only" id="toggle4" checked />
                      <label
                        htmlFor="toggle4"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span
                          className="bg-white block h-6 w-6 rounded-full transform translate-x-0 transition-transform duration-200"
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Agent Errors</p>
                      <p className="text-gray-500 text-sm">
                        Receive notifications when an agent encounters an error
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 select-none">
                      <input type="checkbox" className="sr-only" id="toggle5" checked />
                      <label
                        htmlFor="toggle5"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span
                          className="bg-white block h-6 w-6 rounded-full transform translate-x-0 transition-transform duration-200"
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Button className="bg-action-primary hover:bg-opacity-90">
                  Save Notification Settings
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">User Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Language and Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select className="w-full border border-gray-300 rounded-md shadow-sm p-2">
                      <option>English</option>
                      <option>Italian</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Zone
                    </label>
                    <select className="w-full border border-gray-300 rounded-md shadow-sm p-2">
                      <option>Central European Time (UTC+1)</option>
                      <option>Greenwich Mean Time (UTC)</option>
                      <option>Eastern Time (UTC-5)</option>
                      <option>Pacific Time (UTC-8)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Currency</h3>
                <div className="max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Currency
                  </label>
                  <select className="w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option>Euro (€)</option>
                    <option>US Dollar ($)</option>
                    <option>British Pound (£)</option>
                    <option>Japanese Yen (¥)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Appearance</h3>
                <div className="space-y-3 max-w-md">
                  <div className="flex items-center">
                    <input type="radio" id="light" name="theme" value="light" checked className="mr-2" />
                    <label htmlFor="light" className="text-gray-700">Light Theme</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="dark" name="theme" value="dark" className="mr-2" />
                    <label htmlFor="dark" className="text-gray-700">Dark Theme</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="system" name="theme" value="system" className="mr-2" />
                    <label htmlFor="system" className="text-gray-700">System Default</label>
                  </div>
                </div>
              </div>
              
              <div>
                <Button className="bg-action-primary hover:bg-opacity-90">
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Account Activity</h2>
            
            <div className="space-y-6">
              <div className="border-l-2 border-gray-200 pl-4 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[21px] bg-blue-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Agent Session Completed</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Successfully completed a session with SKY BOOST v1
                      </p>
                    </div>
                    <div className="text-gray-500 text-sm">2 hours ago</div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[21px] bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Password Updated</p>
                      <p className="text-gray-500 text-sm mt-1">
                        You updated your account password
                      </p>
                    </div>
                    <div className="text-gray-500 text-sm">Yesterday</div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[21px] bg-blue-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Agent Session Started</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Started a new session with SKY BOOST v2
                      </p>
                    </div>
                    <div className="text-gray-500 text-sm">2 days ago</div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[21px] bg-purple-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Your account was created
                      </p>
                    </div>
                    <div className="text-gray-500 text-sm">April 1, 2025</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline">
                  View Full Activity Log
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
