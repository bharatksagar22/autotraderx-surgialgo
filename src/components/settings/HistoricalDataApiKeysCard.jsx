import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import useGenericApiKeys from '@/hooks/useBrokerApiKeys';

const HistoricalDataApiKeysCard = () => {
  const { apiKeys, addOrUpdateApiKey, removeApiKey, loading } = useGenericApiKeys('smartTraderHistoricalDataApiKeys');
  const { toast } = useToast();

  const [currentProviderName, setCurrentProviderName] = useState('');
  const [currentApiKey, setCurrentApiKey] = useState('');
  const [currentApiSecret, setCurrentApiSecret] = useState('');
  const [showSecret, setShowSecret] = useState({});

  const handleAddApiKey = () => {
    if (!currentProviderName.trim() || !currentApiKey.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide data provider name and API key." });
      return;
    }
    addOrUpdateApiKey(currentProviderName, currentApiKey, currentApiSecret);
    setCurrentProviderName('');
    setCurrentApiKey('');
    setCurrentApiSecret('');
  };

  const toggleSecretVisibility = (serviceName) => {
    setShowSecret(prev => ({ ...prev, [serviceName]: !prev[serviceName] }));
  };

  return (
    <Card className="glassmorphic shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-gradient-primary">
          <Database className="mr-2 h-6 w-6" /> Historical Data API Keys
        </CardTitle>
        <CardDescription>Manage API keys for historical data providers (for backtesting).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border border-border rounded-md bg-background/30">
          <h3 className="font-semibold text-foreground">Add New Historical Data API Key</h3>
          <div>
            <Label htmlFor="historicalProviderName">Data Provider Name (e.g., AlphaVantage)</Label>
            <Input id="historicalProviderName" placeholder="AlphaVantage" value={currentProviderName} onChange={(e) => setCurrentProviderName(e.target.value)} className="bg-background/70"/>
          </div>
          <div>
            <Label htmlFor="historicalApiKey">API Key</Label>
            <Input id="historicalApiKey" placeholder="Your Data Provider API Key" value={currentApiKey} onChange={(e) => setCurrentApiKey(e.target.value)} className="bg-background/70"/>
          </div>
          <div>
            <Label htmlFor="historicalApiSecret">Secret Key (Optional)</Label>
            <Input id="historicalApiSecret" type="password" placeholder="Your Data Provider Secret Key" value={currentApiSecret} onChange={(e) => setCurrentApiSecret(e.target.value)} className="bg-background/70"/>
          </div>
          <Button onClick={handleAddApiKey} disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            {loading ? 'Saving...' : 'Add Data API Key'}
          </Button>
        </div>

        {loading && <p className="text-muted-foreground">Loading Historical Data API Keys...</p>}
        {!loading && apiKeys.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Saved Historical Data API Keys</h3>
            {apiKeys.map((keyItem) => (
              <div key={keyItem.serviceName} className="flex items-center justify-between p-3 border border-border rounded-md bg-background/30">
                <div>
                  <p className="font-medium text-foreground">{keyItem.serviceName}</p>
                  <p className="text-sm text-muted-foreground">API Key: {keyItem.apiKey.substring(0,8)}**********</p>
                  {keyItem.secretKey && (
                     <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">Secret Key: {showSecret[keyItem.serviceName] ? keyItem.secretKey : '••••••••••••'}</p>
                        <Button variant="ghost" size="sm" onClick={() => toggleSecretVisibility(keyItem.serviceName)} className="ml-2">
                            {showSecret[keyItem.serviceName] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeApiKey(keyItem.serviceName)} disabled={loading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {!loading && apiKeys.length === 0 && (
           <p className="text-muted-foreground text-center py-4">No historical data API keys added yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalDataApiKeysCard;