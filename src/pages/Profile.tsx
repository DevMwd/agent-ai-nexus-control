
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Edit, Upload, Lock } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    firstName: 'Demo',
    lastName: 'User',
    email: user?.email || '',
    photoUrl: ''
  });

  const [passwordReset, setPasswordReset] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordReset(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handlePhotoUpload = () => {
    toast({
      title: "Photo Upload",
      description: "Profile photo upload will be implemented in a future update.",
    });
  };

  const handleTogglePasswordReset = () => {
    setShowPasswordForm(!showPasswordForm);
    setPasswordReset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordReset.newPassword !== passwordReset.confirmPassword) {
      toast({
        title: "Password Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Reset",
      description: "Your password has been reset successfully.",
    });
    
    setShowPasswordForm(false);
    setPasswordReset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Function to get the first character of the user's name or username
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="w-36 h-36">
                <AvatarImage src={user?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Profile" />
                <AvatarFallback className="text-4xl">{getUserInitial()}</AvatarFallback>
              </Avatar>
              <button 
                onClick={handlePhotoUpload}
                className="absolute -bottom-2 right-0 bg-action-primary text-white rounded-full p-2 shadow-lg hover:bg-indigo-600 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
            <Button 
              variant="outline" 
              onClick={handlePhotoUpload}
              className="flex items-center gap-2 mt-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </Button>
            <Button 
              variant="ghost"
              onClick={handleTogglePasswordReset}
              className="flex items-center gap-2 mt-4 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-md border transition"
            >
              <Lock className="w-4 h-4" />
              <span>Reset Password</span>
            </Button>
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email addresses cannot be changed</p>
              </div>
              
              {showPasswordForm && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-700">Reset Password</h3>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordReset.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordReset.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordReset.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        type="submit"
                        variant="action"
                      >
                        Update Password
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={handleTogglePasswordReset}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  variant="action"
                  onClick={handleSaveProfile}
                  className="w-full md:w-auto"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
