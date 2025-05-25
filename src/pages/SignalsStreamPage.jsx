import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ArrowUpCircle, ArrowDownCircle, MinusCircle, WifiOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useWebSocket from '@/hooks/useWebSocket';
import { addLiveSignal, selectLiveSignals, selectSignalsStatus, setSignalsError, clearSignalsError } from '@/redux/slices/signalsSlice';
import { useToast } from "@/components/ui/use-toast";

const SignalsStreamPage = () => {
  const dispatch = useDispatch();
  const liveSignals = useSelector(selectLiveSignals);
  const signalsStatus = useSelector(selectSignalsStatus);
  const { toast } = useToast();

  const handleNewSignal = React.useCallback((signalData) => {
    try {
      const parsedSignal = typeof signalData === 'string' ? JSON.parse(signalData) : signalData;
      // Ensure all critical fields are present
      if (parsedSignal && parsedSignal.type && parsedSignal.asset && parsedSignal.price && parsedSignal.strategy && parsedSignal.timestamp) {
        dispatch(addLiveSignal(parsedSignal));
        dispatch(clearSignalsError());
      } else {
        console.warn("Received signal with missing critical data:", parsedSignal);
        // Optionally, dispatch an error or show a less intrusive notification
        // For now, logging it is sufficient to avoid spamming toasts for minor issues.
      }
    } catch (error) {
      console.error("Error processing signal data from WebSocket:", error);
      dispatch(setSignalsError("Failed to process incoming signal."));
      toast({
        variant: "destructive",
        title: "WebSocket Data Error",
        description: "Received malformed signal data. Check console for details.",
      });
    }
  }, [dispatch, toast]);

  const { isConnected } = useWebSocket('/ws/signals', handleNewSignal);

  useEffect(() => {
    if (!isConnected && signalsStatus !== 'failed') {
      dispatch(setSignalsError("WebSocket disconnected. Attempting to reconnect..."));
    } else if (isConnected && signalsStatus === 'failed') {
      dispatch(clearSignalsError());
       toast({
        title: "WebSocket Reconnected",
        description: "Successfully reconnected to live signals stream.",
        className: "bg-green-100 dark:bg-green-800 border-green-500 text-green-700 dark:text-green-200"
      });
    }
  }, [isConnected, dispatch, signalsStatus, toast]);


  const getSignalIcon = (type) => {
    if (type === 'BUY') return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
    if (type === 'SELL') return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
    return <MinusCircle className="h-5 w-5 text-yellow-500" />;
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
          <Zap className="mr-3 h-8 w-8 text-primary" /> Real-Time Signals
        </h1>
        {!isConnected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-sm text-destructive animate-pulse"
          >
            <WifiOff className="mr-2 h-5 w-5" />
            Connecting...
          </motion.div>
        )}
         {isConnected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-sm text-green-500"
          >
            <Zap className="mr-2 h-5 w-5 animate-pulse" />
            Live
          </motion.div>
        )}
      </div>
      
      <Card className="shadow-lg glassmorphic">
        <CardHeader>
          <CardTitle className="text-xl">Live Signal Feed</CardTitle>
        </CardHeader>
        <CardContent>
          {signalsStatus === 'loading' && liveSignals.length === 0 && (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading initial signals...</p>
            </div>
          )}
          {liveSignals.length === 0 && signalsStatus !== 'loading' && (
             <div className="text-center py-8 text-muted-foreground">
                <Zap className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No live signals yet. Waiting for new data...</p>
                {!isConnected && <p className="text-sm text-destructive mt-2">Connection to signals server is currently down.</p>}
            </div>
          )}
          {liveSignals.length > 0 && (
            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {liveSignals.map((signal, index) => (
                <motion.div
                  key={signal.id || `${signal.timestamp}-${index}-${signal.asset}-${signal.price}`} 
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <Card className={`bg-card border-l-4 ${signal.type === 'BUY' ? 'border-green-500' : signal.type === 'SELL' ? 'border-red-500' : 'border-yellow-500'} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                      <div className="flex items-center space-x-2 col-span-2 md:col-span-1">
                        {getSignalIcon(signal.type)}
                        <span className={`font-semibold ${signal.type === 'BUY' ? 'text-green-500' : signal.type === 'SELL' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {signal.type}
                        </span>
                      </div>
                      <div className="text-sm"><strong className="text-foreground">Asset:</strong> {signal.asset}</div>
                      <div className="text-sm"><strong className="text-foreground">Price:</strong> ${typeof signal.price === 'number' ? signal.price.toFixed(2) : signal.price}</div>
                      <div className="text-sm truncate"><strong className="text-foreground">Strategy:</strong> {signal.strategy}</div>
                      <div className="text-sm text-right text-muted-foreground">{new Date(signal.timestamp || Date.now()).toLocaleTimeString()}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SignalsStreamPage;