import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Activity, TrendingUp, AlertTriangle, Bell, CheckCircle, ListChecks, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStrategies as fetchAllStrategies, getDailyPerformance } from '@/api/index';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { useSelector, useDispatch } from 'react-redux';
import { selectLiveSignals, addLiveSignal } from '@/redux/slices/signalsSlice';
import useWebSocket from '@/hooks/useWebSocket';

const DashboardOverviewPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const liveSignalsFromStore = useSelector(selectLiveSignals);
  const [overviewData, setOverviewData] = useState({
    totalActiveStrategies: 0,
    activeStrategiesList: [],
    signalsToday: 0,
    dailyProfitLoss: 0,
    alertsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [connectedBroker, setConnectedBroker] = useState(null);

  const handleNewSignal = useCallback((signalData) => {
    try {
      const parsedSignal = typeof signalData === 'string' ? JSON.parse(signalData) : signalData;
      if (parsedSignal && parsedSignal.type && parsedSignal.asset && parsedSignal.price && parsedSignal.strategy && parsedSignal.timestamp) {
        dispatch(addLiveSignal(parsedSignal));
        setOverviewData(prev => ({ ...prev, signalsToday: prev.signalsToday + 1 }));
      } else {
        console.warn("Received signal with unexpected or incomplete structure:", parsedSignal);
        toast({
          variant: "destructive",
          title: "Malformed Signal",
          description: "Received a signal with missing critical data.",
        });
      }
    } catch (error) {
      console.error("Error processing signal data from WebSocket:", error);
      toast({
        variant: "destructive",
        title: "Signal Processing Error",
        description: "Could not process an incoming signal.",
      });
    }
  }, [dispatch, toast]);
  
  const { isConnected: isWebSocketConnected } = useWebSocket('/ws/signals', handleNewSignal);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const strategiesData = await fetchAllStrategies();
      const activeStrategies = strategiesData.filter(s => s.status === 'ON');
      
      let performance = { profitLoss: 0 }; 
      if (user && user.id) {
        try {
          const today = new Date().toISOString().split('T')[0];
          performance = await getDailyPerformance(user.id, today);
        } catch (perfError) {
          console.warn("Could not fetch daily performance:", perfError);
          toast({
            variant: "default",
            title: "Performance Data Note",
            description: "Could not load today's P/L. Displaying $0.00.",
            className: "bg-yellow-100 dark:bg-yellow-800 border-yellow-500 text-yellow-700 dark:text-yellow-200"
          });
          performance = { profitLoss: 0 }; // Fallback on error
        }
      }

      setOverviewData(prev => ({
        ...prev,
        totalActiveStrategies: activeStrategies.length,
        activeStrategiesList: activeStrategies.slice(0, 5).map(s => s.name || 'Unnamed Strategy'),
        dailyProfitLoss: performance.profitLoss || 0,
        alertsCount: 3, // Mock alerts, replace with actual data if available
      }));

    } catch (error) {
      console.error("Failed to fetch dashboard overview:", error);
      toast({
        variant: "destructive",
        title: "Error Loading Dashboard",
        description: "Could not fetch strategies or other critical data.",
      });
      setOverviewData(prev => ({ 
        ...prev,
        totalActiveStrategies: 0,
        activeStrategiesList: [],
        dailyProfitLoss: 0,
        signalsToday: 0, // Reset or keep existing from WebSocket
        alertsCount: 0,
      }));
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchDashboardData();
    const brokerInfo = localStorage.getItem('smartTraderConnectedBroker');
    if (brokerInfo) {
      try {
        setConnectedBroker(JSON.parse(brokerInfo));
      } catch (e) {
        console.error("Error parsing broker info from localStorage", e);
        localStorage.removeItem('smartTraderConnectedBroker');
      }
    }
  }, [fetchDashboardData]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const StatCard = ({ title, value, icon, trend, unit = '', color = "text-primary" }) => (
    <motion.div variants={cardVariants}>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${color}`}>{unit}{value}</div>
          {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-xl text-muted-foreground">Loading SmartTrader Dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">SmartTrader Dashboard</h1>
        <div className="flex items-center gap-4">
            {isWebSocketConnected ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center text-sm text-green-500">
                    <Zap className="mr-1 h-4 w-4 animate-pulse" /> Live Signals
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center text-sm text-red-500">
                    <Zap className="mr-1 h-4 w-4" /> Signals Offline
                </motion.div>
            )}
            {connectedBroker && (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center p-2 bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-700 rounded-md text-green-700 dark:text-green-200"
            >
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Broker: {connectedBroker.name}</span>
            </motion.div>
            )}
        </div>
      </div>
      
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 }}
        }}
      >
        <StatCard title="Active Strategies" value={overviewData.totalActiveStrategies} icon={<Activity />} trend={overviewData.activeStrategiesList.length > 0 ? `${overviewData.activeStrategiesList[0]}` : 'None'} color="text-blue-500" />
        <StatCard title="Signals Today" value={overviewData.signalsToday} icon={<Bell />} trend={liveSignalsFromStore.length > 0 && liveSignalsFromStore[0].asset ? `${liveSignalsFromStore[0].asset} ${liveSignalsFromStore[0].type}` : 'Awaiting signals'} color="text-indigo-500"/>
        <StatCard title="Daily P/L" value={(overviewData.dailyProfitLoss || 0).toFixed(2)} unit="$" icon={<TrendingUp />} trend="Based on closed trades" color={(overviewData.dailyProfitLoss || 0) >= 0 ? "text-green-500" : "text-red-500"} />
        <StatCard title="Active Alerts" value={overviewData.alertsCount} icon={<AlertTriangle />} trend="1 critical" color="text-red-500" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="shadow-lg glassmorphic h-[400px]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <LineChart className="h-10 w-10 text-primary" /> <p className="ml-2 text-muted-foreground">Portfolio chart coming soon...</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg glassmorphic h-[400px]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Active Strategies ({overviewData.totalActiveStrategies})</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[320px]">
              {overviewData.activeStrategiesList.length > 0 ? (
                <ul className="space-y-2">
                  {overviewData.activeStrategiesList.map(name => (
                    <li key={name} className="flex items-center text-sm text-muted-foreground p-2 bg-background/50 rounded-md">
                      <ListChecks className="h-4 w-4 mr-2 text-green-500" /> {name}
                    </li>
                  ))}
                  {overviewData.totalActiveStrategies > overviewData.activeStrategiesList.length && (
                     <li className="text-xs text-muted-foreground text-center pt-1">...and {overviewData.totalActiveStrategies - overviewData.activeStrategiesList.length} more.</li>
                  )}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No strategies currently active.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={cardVariants}>
            <Card className="shadow-lg glassmorphic h-[300px]">
                <CardHeader><CardTitle className="text-lg font-semibold text-foreground">Strategy Allocation</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                    <PieChart className="h-10 w-10 text-primary" /> <p className="ml-2 text-muted-foreground">Strategy allocation chart coming soon...</p>
                </CardContent>
            </Card>
        </motion.div>
        <motion.div variants={cardVariants}>
            <Card className="shadow-lg glassmorphic h-[300px]">
                <CardHeader><CardTitle className="text-lg font-semibold text-foreground">Recent Live Signals ({liveSignalsFromStore.length > 10 ? '10+' : liveSignalsFromStore.length})</CardTitle></CardHeader>
                <CardContent className="overflow-y-auto max-h-[220px]">
                     {liveSignalsFromStore.length > 0 ? (
                        <ul className="space-y-2">
                            {liveSignalsFromStore.slice(0, 5).map((signal, index) => (
                                <li key={signal.id || `${signal.timestamp}-${index}-${signal.asset}`} className={`text-xs p-1.5 rounded flex justify-between items-center bg-background/50 border-l-2 ${signal.type === 'BUY' ? 'border-green-500' : signal.type === 'SELL' ? 'border-red-500' : 'border-yellow-500'}`}>
                                    <span>{signal.asset} - <span className={signal.type === 'BUY' ? 'text-green-500' : signal.type === 'SELL' ? 'text-red-500' : 'text-yellow-500'}>{signal.type}</span> @ ${signal.price}</span>
                                    <span className="text-muted-foreground/70">{new Date(signal.timestamp).toLocaleTimeString()}</span>
                                </li>
                            ))}
                        </ul>
                     ) : (
                        <p className="text-muted-foreground text-center py-4">Awaiting live signals...</p>
                     )}
                </CardContent>
            </Card>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default DashboardOverviewPage;