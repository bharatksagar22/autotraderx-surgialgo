import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Key, Trash2, Eye, EyeOff, Briefcase, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import useGenericApiKeys from '@/hooks/useBrokerApiKeys';
import { connectAngelOneBroker } from '@/api/index';

const BrokerApiKeysCard = () => {
  const { apiKeys, addOrUpdateApiKey, removeApiKey, loading: genericKeysLoading } = useGenericApiKeys('smartTraderBrokerApiKeys');
  const { toast } = useToast();

  const [currentBrokerKey, setCurrentBrokerKey] = useState('');
  const [currentBrokerSecret, setCurrentBrokerSecret] = useState('');
  const [currentBrokerName, setCurrentBrokerName] = useState('');
  const [showSecret, setShowSecret] = useState({});
  
  const [angelOneClientId, setAngelOneClientId] = useState('');
  const [angelOnePassword, setAngelOnePassword] = useState('');
  const [angelOneTotp, setAngelOneTotp] = useState('');
  const [isAngelOneModalOpen, setIsAngelOneModalOpen] = useState(false);
  const [isConnectingAngelOne, setIsConnectingAngelOne] = useState(false);


  const handleAddBrokerApiKey = () => {
    if (!currentBrokerName.trim() || !currentBrokerKey.trim() || !currentBrokerSecret.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide broker name, API key, and secret key." });
      return;
    }
    addOrUpdateApiKey(currentBrokerName, currentBrokerKey, currentBrokerSecret);
    setCurrentBrokerName('');
    setCurrentBrokerKey('');
    setCurrentBrokerSecret('');
  };

  const handleConnectAngelOne = async () => {
    if (!angelOneClientId || !angelOnePassword || !angelOneTotp) {
        toast({ variant: "destructive", title: "AngelOne Login Failed", description: "Please provide Client ID, Password, and TOTP."});
        return;
    }
    setIsConnectingAngelOne(true);
    try {
        // Actual API call to your backend
        const response = await connectAngelOneBroker({ 
            client_id: angelOneClientId, 
            password: angelOnePassword, 
            totp: angelOneTotp 
        });

        // Assuming backend returns { success: true, message: "...", brokerDetails: { apiKey, secretKey } }
        // or { success: false, message: "Error details" }
        if (response && response.success) {
            // If backend provides API key/secret after successful connection, use them
            // Otherwise, you might store a generic "AngelOne Connected" status.
            // For this example, let's assume backend sends back details to store.
            if(response.brokerDetails && response.brokerDetails.apiKey) {
                 addOrUpdateApiKey("AngelOne", response.brokerDetails.apiKey, response.brokerDetails.secretKey || '');
            } else {
                // If no specific keys are returned, store a generic entry
                addOrUpdateApiKey("AngelOne", `connected_user_${angelOneClientId}`, 'session_active');
            }
            localStorage.setItem('smartTraderConnectedBroker', JSON.stringify({ name: "AngelOne", status: "Connected", user: angelOneClientId }));
            toast({ title: "AngelOne Connected", description: response.message || "Successfully connected to AngelOne." });
            setAngelOneClientId('');
            setAngelOnePassword('');
            setAngelOneTotp('');
            setIsAngelOneModalOpen(false);
        } else {
            throw new Error(response?.message || "Failed to connect to AngelOne. Please check credentials or backend logs.");
        }
    } catch (error) {
        console.error("AngelOne connection error:", error);
        toast({ variant: "destructive", title: "AngelOne Connection Failed", description: error.message || "An unexpected error occurred."});
    } finally {
        setIsConnectingAngelOne(false);
    }
  };


  const toggleSecretVisibility = (serviceName) => {
    setShowSecret(prev => ({ ...prev, [serviceName]: !prev[serviceName] }));
  };

  return (
    <Card className="glassmorphic shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-gradient-primary">
          <Briefcase className="mr-2 h-6 w-6" /> Broker API Keys & Connections
        </CardTitle>
        <CardDescription>Manage API keys for custom brokers or connect directly to supported brokers like AngelOne.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border border-border rounded-md bg-background/30">
            <h3 className="font-semibold text-foreground mb-2">Connect AngelOne Account</h3>
            <p className="text-sm text-muted-foreground mb-3">
                Securely connect your AngelOne account for trading. This will be handled by your backend.
            </p>
            <Dialog open={isAngelOneModalOpen} onOpenChange={setIsAngelOneModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white">
                        <LinkIcon className="mr-2 h-4 w-4" /> Connect to AngelOne
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glassmorphic">
                    <DialogHeader>
                        <DialogTitle>Connect to AngelOne</DialogTitle>
                        <DialogDescription>
                            Enter your AngelOne credentials. These will be sent to your secure backend for connection.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="angelOneClientId" className="text-right">Client ID</Label>
                            <Input id="angelOneClientId" value={angelOneClientId} onChange={(e) => setAngelOneClientId(e.target.value)} className="col-span-3 bg-background/70" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="angelOnePassword" className="text-right">Password</Label>
                            <Input id="angelOnePassword" type="password" value={angelOnePassword} onChange={(e) => setAngelOnePassword(e.target.value)} className="col-span-3 bg-background/70" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="angelOneTotp" className="text-right">TOTP / PIN</Label>
                            <Input id="angelOneTotp" value={angelOneTotp} onChange={(e) => setAngelOneTotp(e.target.value)} className="col-span-3 bg-background/70" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleConnectAngelOne} disabled={isConnectingAngelOne} className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white">
                            {isConnectingAngelOne && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isConnectingAngelOne ? 'Connecting...' : 'Connect Account'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        
        <div className="space-y-4 p-4 border border-border rounded-md bg-background/30">
          <h3 className="font-semibold text-foreground">Add Custom Broker API Key (Manual)</h3>
          <p className="text-sm text-muted-foreground">For brokers not directly supported, add their API keys here if your backend is configured to use them.</p>
          <div>
            <Label htmlFor="brokerName">Broker Name (e.g., Zerodha, Upstox)</Label>
            <Input id="brokerName" placeholder="Your Broker Name" value={currentBrokerName} onChange={(e) => setCurrentBrokerName(e.target.value)} className="bg-background/70"/>
          </div>
          <div>
            <Label htmlFor="brokerApiKey">API Key</Label>
            <Input id="brokerApiKey" placeholder="Your Broker API Key" value={currentBrokerKey} onChange={(e) => setCurrentBrokerKey(e.target.value)} className="bg-background/70"/>
          </div>
          <div>
            <Label htmlFor="brokerApiSecret">Secret Key</Label>
            <Input id="brokerApiSecret" type="password" placeholder="Your Broker Secret Key" value={currentBrokerSecret} onChange={(e) => setCurrentBrokerSecret(e.target.value)} className="bg-background/70"/>
          </div>
          <Button onClick={handleAddBrokerApiKey} disabled={genericKeysLoading} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
            {genericKeysLoading ? 'Saving...' : 'Add Custom Broker API Key'}
          </Button>
        </div>

        {genericKeysLoading && <p className="text-muted-foreground">Loading Saved Broker API Keys...</p>}
        {!genericKeysLoading && apiKeys.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Saved Broker API Keys & Connections</h3>
            {apiKeys.map((keyItem) => (
              <div key={keyItem.serviceName} className="flex items-center justify-between p-3 border border-border rounded-md bg-background/30">
                <div>
                  <p className="font-medium text-foreground">{keyItem.serviceName}</p>
                  <p className="text-sm text-muted-foreground">API Key / Identifier: {keyItem.apiKey.substring(0,8)}**********</p>
                  {keyItem.secretKey && keyItem.secretKey !== 'session_active' && (
                    <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">Secret Key: {showSecret[keyItem.serviceName] ? keyItem.secretKey : '••••••••••••'}</p>
                        <Button variant="ghost" size="sm" onClick={() => toggleSecretVisibility(keyItem.serviceName)} className="ml-2">
                            {showSecret[keyItem.serviceName] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                  )}
                  {keyItem.secretKey === 'session_active' && (
                     <p className="text-sm text-green-500">Session Active</p>
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeApiKey(keyItem.serviceName)} disabled={genericKeysLoading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {!genericKeysLoading && apiKeys.length === 0 && (
           <p className="text-muted-foreground text-center py-4">No broker connections or API keys saved yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BrokerApiKeysCard;