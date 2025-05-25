
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCog, PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminUserManagementPage = () => {
  const users = [
    { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', role: 'Admin', status: 'Active', broker: 'AngelOne' },
    { id: 2, name: 'Bob The Trader', email: 'bob@example.com', role: 'User', status: 'Active', broker: 'Zerodha' },
    { id: 3, name: 'Charlie Investor', email: 'charlie@example.com', role: 'User', status: 'Inactive', broker: 'Upstox' },
  ];
  
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <UserCog className="mr-3 h-7 w-7 text-primary" /> User Management
        </h1>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <Card className="shadow-lg glassmorphic">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs text-foreground uppercase bg-secondary/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Role</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Broker Account</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y:10 }}
                    animate={{ opacity: 1, y:0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-card border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.broker}</td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600"><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminUserManagementPage;
  