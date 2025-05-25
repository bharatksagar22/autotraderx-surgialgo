
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Zap, Bell, Settings, Shield, UserCog, FileText, GitFork } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const commonNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/strategies', label: 'Strategies', icon: GitFork },
  { href: '/signals', label: 'Signals', icon: Zap },
  { href: '/trades', label: 'Trade Performance', icon: BarChart2 },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

const adminNavItems = [
  { href: '/admin/users', label: 'User Management', icon: UserCog },
  { href: '/admin/logs', label: 'System Logs', icon: FileText },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = user?.role === 'admin' ? [...commonNavItems, ...adminNavItems] : commonNavItems;

  return (
    <aside className="w-64 bg-card text-card-foreground border-r border-border flex flex-col sticky top-0 h-screen">
      <div className="p-6 border-b border-border">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img-replace src="/logo.svg" alt="SmartTrader Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-gradient-primary">SmartTrader</span>
        </Link>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <motion.div
            key={item.href}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out',
                location.pathname.startsWith(item.href)
                  ? 'bg-primary/10 text-primary hover:bg-primary/15'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Link
          to="/profile"
          className={cn(
            'flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out',
            location.pathname === '/profile'
              ? 'bg-primary/10 text-primary hover:bg-primary/15'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings & Profile
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
  