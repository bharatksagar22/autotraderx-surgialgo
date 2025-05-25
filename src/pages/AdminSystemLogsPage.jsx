
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const AdminSystemLogsPage = () => {
  const logs = [
    { id: 1, timestamp: '2025-05-24 10:00:15', level: 'INFO', service: 'AuthService', message: 'User admin@example.com logged in successfully.' },
    { id: 2, timestamp: '2025-05-24 10:05:22', level: 'WARN', service: 'SignalGenerator', message: 'Rate limit approaching for external API.' },
    { id: 3, timestamp: '2025-05-24 10:10:03', level: 'ERROR', service: 'TradeExecutor', message: 'Failed to place trade for strategy AlphaMax: Insufficient funds.' },
    { id: 4, timestamp: '2025-05-24 10:15:48', level: 'INFO', service: 'StrategyManager', message: 'Strategy VolatilityScalperX disabled by user.' },
  ];

  const getLevelColor = (level) => {
    if (level === 'ERROR') return 'text-red-500';
    if (level === 'WARN') return 'text-yellow-500';
    return 'text-green-500';
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <FileText className="mr-3 h-7 w-7 text-primary" /> System Logs
        </h1>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input type="search" placeholder="Search logs..." className="max-w-xs bg-background/70 flex-grow md:flex-grow-0" />
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <Card className="shadow-lg glassmorphic">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs text-foreground uppercase bg-secondary/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Timestamp</th>
                  <th scope="col" className="px-6 py-3">Level</th>
                  <th scope="col" className="px-6 py-3">Service</th>
                  <th scope="col" className="px-6 py-3">Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, y:10 }}
                    animate={{ opacity: 1, y:0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-card border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{log.timestamp}</td>
                    <td className={`px-6 py-4 font-semibold ${getLevelColor(log.level)}`}>{log.level}</td>
                    <td className="px-6 py-4 text-foreground">{log.service}</td>
                    <td className="px-6 py-4">{log.message}</td>
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

export default AdminSystemLogsPage;
  