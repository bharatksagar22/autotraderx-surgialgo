import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
// import { updateUserProfile } from '@/api'; // Assuming API function exists

const ProfileInformationCard = ({ user }) => {
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  const { toast } = useToast();

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // await updateUserProfile(profileData); // Actual API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
      toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message || "Could not update profile." });
    }
  };

  return (
    <Card className="glassmorphic shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-gradient-primary">
          <User className="mr-2 h-6 w-6" /> Profile Information
        </CardTitle>
        <CardDescription>Manage your personal details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} className="bg-background/70"/>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" value={profileData.email} disabled className="bg-background/70 cursor-not-allowed"/>
          </div>
          <Button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileInformationCard;