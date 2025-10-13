import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Shield,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.',
    role: 'CUSTOMER',
    memberSince: '2024-01-15',
    totalOrders: 5,
    totalDevices: 3
  });

  const [formData, setFormData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profileData);
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500';
      case 'CUSTOMER':
        return 'bg-blue-500';
      case 'TECHNICIAN':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" onClick={handleEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 font-medium">{profileData.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 font-medium">{profileData.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <div className="flex items-center mt-2">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <div className="flex items-center mt-2">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="company">Company</Label>
                  {isEditing ? (
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <div className="flex items-center mt-2">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{profileData.company}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <Badge className={getRoleColor(profileData.role)}>
                    {profileData.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{profileData.memberSince}</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                    <span className="font-medium">{profileData.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Devices</span>
                    <span className="font-medium">{profileData.totalDevices}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
