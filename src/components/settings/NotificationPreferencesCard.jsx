import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const NotificationPreferencesCard = () => {
  return (
    <Card className="glassmorphic shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-gradient-primary">
          <Bell className="mr-2 h-6 w-6" /> Notification Preferences
        </CardTitle>
        <CardDescription>Choose how you receive alerts and updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Notification settings coming soon.</p>
        {/* Future: Add checkboxes for Email, SMS, Push notifications etc. */}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferencesCard;