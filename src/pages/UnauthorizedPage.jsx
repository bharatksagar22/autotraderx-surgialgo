
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 10
        }}
        className="flex flex-col items-center"
      >
        <ShieldAlert className="h-32 w-32 text-red-400 mb-8" />
        <h1 className="text-5xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-xl text-red-200 mb-8">You do not have permission to view this page.</p>
        <p className="text-lg text-red-300 mb-10 max-w-md">
          Please contact your administrator if you believe this is an error.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
  