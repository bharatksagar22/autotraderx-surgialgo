import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Cpu, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAiAgentConfig, updateAiAgentConfig } from '@/api/index';

const AiAgentConfigCard = () => {
  const [aiAgentEnabled, setAiAgentEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfig = useCallback(async () => {
    setInitialLoading(true);
    try {
      const config = await getAiAgentConfig();
      setAiAgentEnabled(config.enabled);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not load AI Agent configuration. Using default (enabled)." });
      // Fallback to localStorage or default if API fails
      const storedAgentStatus = localStorage.getItem('smartTraderAiAgentEnabled');
      if (storedAgentStatus !== null) {
        setAiAgentEnabled(JSON.parse(storedAgentStatus));
      } else {
        setAiAgentEnabled(true); // Default to enabled
      }
    } finally {
      setInitialLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const toggleAiAgent = async () => {
    const newStatus = !aiAgentEnabled;
    setLoading(true);
    try {
      await updateAiAgentConfig({ enabled: newStatus });
      setAiAgentEnabled(newStatus);
      localStorage.setItem('smartTraderAiAgentEnabled', JSON.stringify(newStatus));
      toast({ title: "AI Agent Status Updated", description: `AI Agent is now ${newStatus ? 'enabled' : 'disabled'}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update AI Agent status." });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Card className="glassmorphic shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-gradient-primary">
            <Cpu className="mr-2 h-6 w-6" /> AI Agent Configuration
          </CardTitle>
          <CardDescription>Manage settings for the AI trading agent.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading AI Agent settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphic shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-gradient-primary">
          <Cpu className="mr-2 h-6 w-6" /> AI Agent Configuration
        </CardTitle>
        <CardDescription>Manage settings for the AI trading agent.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background/30">
              <Label htmlFor="aiAgentToggle" className="text-base font-medium text-foreground">
                  AI Trading Agent Status
              </Label>
              <Button onClick={toggleAiAgent} variant="outline" size="lg" disabled={loading || initialLoading} className={`w-36 transition-colors duration-300 ease-in-out ${aiAgentEnabled ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (aiAgentEnabled ? <ToggleRight className="mr-2 h-6 w-6" /> : <ToggleLeft className="mr-2 h-6 w-6" />)}
                  {loading ? 'Updating...' : (aiAgentEnabled ? 'Enabled' : 'Disabled')}
              </Button>
          </div>
          <p className="text-sm text-muted-foreground">
              Enable or disable the AI trading agent. When disabled, no new trades will be initiated by the AI.
          </p>
      </CardContent>
    </Card>
  );
};

export default AiAgentConfigCard;