import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Play, Pause, AlertCircle, GitFork, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getStrategyById, toggleStrategyStatus as apiToggleStrategyStatus } from '@/api/index';
import { useToast } from "@/components/ui/use-toast";

const backtestDataMock = [
  { name: 'Jan', equity: 10000 }, { name: 'Feb', equity: 10500 }, { name: 'Mar', equity: 10200 },
  { name: 'Apr', equity: 11000 }, { name: 'May', equity: 11500 }, { name: 'Jun', equity: 12000 },
  { name: 'Jul', equity: 11800 }, { name: 'Aug', equity: 12500 }, { name: 'Sep', equity: 13000 },
  { name: 'Oct', equity: 12800 }, { name: 'Nov', equity: 13500 }, { name: 'Dec', equity: 14000 },
];

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const StrategyDetailsPage = () => {
  const { strategyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [strategy, setStrategy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const fetchStrategyDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getStrategyById(strategyId);
      setStrategy({ ...data, isActive: data.status === 'ON' });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching strategy",
        description: error.message || `Could not load details for strategy ${strategyId}.`,
      });
      // Fallback to mock data if API fails, for demonstration
      setStrategy({
        id: strategyId, name: 'Fallback Strategy', description: 'Details could not be loaded.', status: 'OFF', isActive: false,
        profitRate: 'N/A', totalTrades: 0, winRate: 'N/A', maxDrawdown: 'N/A',
        parameters: { Error: 'Could not load' }, indicators: ['N/A'],
        backtestResults: { totalReturn: 'N/A', sharpeRatio: 0, sortinoRatio: 0 }
      });
    } finally {
      setIsLoading(false);
    }
  }, [strategyId, toast]);

  useEffect(() => {
    fetchStrategyDetails();
  }, [fetchStrategyDetails]);

  const handleToggleStrategyStatus = async () => {
    if (!strategy) return;
    setIsTogglingStatus(true);
    const newStatusBoolean = !strategy.isActive;
    const newStatusString = newStatusBoolean ? 'ON' : 'OFF';

    try {
      await apiToggleStrategyStatus(strategy.id, newStatusBoolean);
      setStrategy(prev => ({ ...prev, isActive: newStatusBoolean, status: newStatusString }));
      toast({
        title: "Strategy Updated",
        description: `${strategy.name} is now ${newStatusString}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating strategy",
        description: error.message || "Could not update strategy status.",
      });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-xl text-muted-foreground">Loading Strategy Details...</p>
      </div>
    );
  }

  if (!strategy) {
    return (
        <div className="p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-destructive">Strategy Not Found</h2>
            <p className="text-muted-foreground">The requested strategy could not be loaded or does not exist.</p>
            <Button variant="outline" onClick={() => navigate('/strategies')} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Strategies
            </Button>
        </div>
    );
  }
  
  const { name, description, status, isActive, profitRate, totalTrades, winRate, maxDrawdown, parameters, indicators, backtestResults } = strategy;

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6"
    >
      <Button variant="outline" onClick={() => navigate('/strategies')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Strategies
      </Button>

      <Card className="shadow-lg glassmorphic">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <GitFork className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl font-bold text-gradient-primary">{name}</CardTitle>
              </div>
              <CardDescription className="mt-1 text-muted-foreground">{description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              <Button 
                size="sm" 
                onClick={handleToggleStrategyStatus}
                disabled={isTogglingStatus}
                className={isActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
              >
                {isTogglingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />)}
                {isTogglingStatus ? 'Updating...' : (isActive ? 'Disable' : 'Enable')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 bg-secondary/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="backtest">Backtest Results</TabsTrigger>
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-background/50">
                <CardHeader><CardTitle>Performance Summary</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div><strong className="text-foreground">Status:</strong> <span className={isActive ? "text-green-500" : "text-red-500"}>{status}</span></div>
                  <div><strong className="text-foreground">Profit Rate (Avg):</strong> {profitRate || 'N/A'}</div>
                  <div><strong className="text-foreground">Total Trades:</strong> {totalTrades || 0}</div>
                  <div><strong className="text-foreground">Win Rate:</strong> {winRate || 'N/A'}</div>
                  <div><strong className="text-foreground">Max Drawdown:</strong> {maxDrawdown || 'N/A'}</div>
                </CardContent>
              </Card>
               <Card className="bg-background/50">
                <CardHeader><CardTitle>Used Indicators</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {indicators && indicators.length > 0 ? indicators.map(ind => <li key={ind}>{ind}</li>) : <li>No indicators specified.</li>}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parameters">
              <Card className="bg-background/50">
                <CardHeader><CardTitle>Configuration Parameters</CardTitle></CardHeader>
                <CardContent>
                  {parameters && Object.keys(parameters).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {Object.entries(parameters).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-border pb-1">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-semibold text-foreground">{value.toString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No parameters configured for this strategy.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backtest">
              <Card className="bg-background/50">
                <CardHeader><CardTitle>Backtest Performance</CardTitle></CardHeader>
                <CardContent>
                  {backtestResults ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                        <div><strong className="text-foreground">Total Return:</strong> {backtestResults.totalReturn || 'N/A'}</div>
                        <div><strong className="text-foreground">Sharpe Ratio:</strong> {backtestResults.sharpeRatio || 'N/A'}</div>
                        <div><strong className="text-foreground">Sortino Ratio:</strong> {backtestResults.sortinoRatio || 'N/A'}</div>
                      </div>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={backtestDataMock} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} domain={['dataMin - 500', 'dataMax + 500']} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                              labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '14px' }} />
                            <Line type="monotone" dataKey="equity" name="Equity Curve" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No backtest results available for this strategy.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs">
              <Card className="bg-background/50">
                <CardHeader><CardTitle>Recent Activity Logs</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground flex items-center"><AlertCircle className="w-4 h-4 mr-2 text-yellow-500" /> Activity log feature coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StrategyDetailsPage;