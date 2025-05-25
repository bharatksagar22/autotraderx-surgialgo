
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const NotificationsPage = () => {
  const notifications = [
    { id: 1, type: 'signal', title: 'New Signal: BUY BTC/USD', message: 'Strategy "AlphaMax" triggered a BUY signal for BTC/USD at $62,500.', time: '2 min ago', read: false, icon: <Info className="text-blue-500" /> },
    { id: 2, type: 'alert', title: 'High Volatility Warning', message: 'BTC/USD showing high volatility. Adjust risk parameters if needed.', time: '15 min ago', read: false, icon: <AlertTriangle className="text-yellow-500" /> },
    { id: 3, type: 'strategy', title: 'Strategy "TrendMaster v2" Activated', message: 'Admin approved and activated new strategy "TrendMaster v2".', time: '1 hour ago', read: true, icon: <CheckCircle className="text-green-500" /> },
    { id: 4, type: 'system', title: 'Scheduled Maintenance', message: 'System maintenance scheduled for tomorrow at 02:00 UTC.', time: '3 hours ago', read: true, icon: <Info className="text-purple-500" /> },
  ];

  const [currentNotifications, setCurrentNotifications] = React.useState(notifications);

  const markAsRead = (id) => {
    setCurrentNotifications(currentNotifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setCurrentNotifications(currentNotifications.map(n => ({ ...n, read: true })));
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };
  
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
          <Bell className="mr-3 h-8 w-8 text-primary" /> Notifications
        </h1>
        <Button onClick={markAllAsRead} variant="outline" disabled={currentNotifications.every(n => n.read)}>
          Mark All as Read
        </Button>
      </div>

      <Card className="shadow-lg glassmorphic">
        <CardContent className="pt-6 space-y-4">
          {currentNotifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No new notifications.</p>
          ) : (
            currentNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`p-4 flex items-start space-x-4 ${notification.read ? 'bg-secondary/30 opacity-70' : 'bg-card hover:shadow-md transition-shadow'}`}>
                  <div className="flex-shrink-0 mt-1">
                    {React.cloneElement(notification.icon, { className: "h-6 w-6" })}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-foreground">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    {!notification.read && (
                      <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-primary" onClick={() => markAsRead(notification.id)}>
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsPage;
  