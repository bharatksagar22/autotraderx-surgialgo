import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Filter, GitFork, Play, Pause, Eye, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { getStrategies, toggleStrategyStatus as apiToggleStrategyStatus } from '@/api/index';

const StrategiesListPage = () => {
  const [strategies, setStrategies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [togglingStrategyId, setTogglingStrategyId] = useState(null);
  const { toast } = useToast();

  const fetchStrategies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getStrategies();
      setStrategies(data.map(s => ({ ...s, isActive: s.status === 'ON' })));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching strategies",
        description: error.message || "Could not load strategies.",
      });
      setStrategies([
        { id: '1', name: 'AlphaMax Trend Rider', status: 'ON', profitRate: '15.2%', type: 'Trend Following', lastSignal: 'BUY BTC 2h ago', isActive: true },
        { id: '2', name: 'Volatility Scalper X', status: 'OFF', profitRate: '8.5%', type: 'Scalping', lastSignal: 'SELL ETH 1d ago', isActive: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const handleToggleStrategy = async (strategyId) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (!strategy) return;

    const newStatusBoolean = !strategy.isActive;
    const newStatusString = newStatusBoolean ? 'ON' : 'OFF';
    setTogglingStrategyId(strategyId);

    const originalStrategies = [...strategies];
    
    setStrategies(prevStrategies =>
      prevStrategies.map(s =>
        s.id === strategyId ? { ...s, isActive: newStatusBoolean, status: newStatusString } : s
      )
    );

    try {
      await apiToggleStrategyStatus(strategyId, newStatusBoolean);
      toast({
        title: "Strategy Updated",
        description: `${strategy.name} is now ${newStatusString}.`,
      });
    } catch (error) {
      setStrategies(originalStrategies);
      toast({
        variant: "destructive",
        title: "Error updating strategy",
        description: error.message || "Could not update strategy status.",
      });
    } finally {
      setTogglingStrategyId(null);
    }
  };

  const filteredStrategies = strategies.filter(strategy =>
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
          <GitFork className="mr-3 h-8 w-8 text-primary" /> Strategies Management
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Strategy
          </Button>
        </div>
      </div>

      <Card className="shadow-lg glassmorphic">
        <CardHeader>
          <Input 
            type="search" 
            placeholder="Search strategies by name..." 
            className="max-w-sm bg-background/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading strategies...
            </div>
          ) : filteredStrategies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No strategies found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-xs text-foreground uppercase bg-secondary/50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Profit Rate</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Last Signal</th>
                    <th scope="col" className="px-6 py-3 text-center">Toggle Active</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStrategies.map((strategy, index) => (
                    <motion.tr 
                      key={strategy.id}
                      layout
                      initial={{ opacity: 0, y:10 }}
                      animate={{ opacity: 1, y:0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-card border-b border-border hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{strategy.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${strategy.isActive ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'}`}>
                          {strategy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{strategy.profitRate || 'N/A'}</td>
                      <td className="px-6 py-4">{strategy.type || 'N/A'}</td>
                      <td className="px-6 py-4">{strategy.lastSignal || 'N/A'}</td>
                      <td className="px-6 py-4 text-center">
                        <Button 
                          variant={strategy.isActive ? "destructive" : "default"} 
                          size="sm" 
                          onClick={() => handleToggleStrategy(strategy.id)}
                          disabled={togglingStrategyId === strategy.id}
                          className={strategy.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                        >
                          {togglingStrategyId === strategy.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (strategy.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />)}
                          <span className="ml-1">{togglingStrategyId === strategy.id ? 'Updating...' : (strategy.isActive ? 'Turn OFF' : 'Turn ON')}</span>
                        </Button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/strategies/${strategy.id}`}>
                            <Eye className="mr-1 h-4 w-4" /> View
                          </Link>
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StrategiesListPage;