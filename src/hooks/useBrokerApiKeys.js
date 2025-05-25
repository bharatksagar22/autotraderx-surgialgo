import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

const useGenericApiKeys = (storageKeySuffix) => {
  const STORAGE_KEY = `smartTrader_${storageKeySuffix}`;
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadApiKeys = useCallback(() => {
    setLoading(true);
    try {
      const storedKeys = localStorage.getItem(STORAGE_KEY);
      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      } else {
        setApiKeys([]);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error loading API keys for ${storageKeySuffix}`,
        description: error.message || "Could not load API key configurations.",
      });
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  }, [toast, STORAGE_KEY, storageKeySuffix]);

  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);

  const saveApiKeys = async (updatedKeys) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call:
      // await updateUserProfile({ [storageKeySuffix]: updatedKeys });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKeys));
      setApiKeys(updatedKeys);
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error saving API keys for ${storageKeySuffix}`,
        description: error.message || "Could not save API key configurations.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateApiKey = async (serviceName, apiKey, secretKey = '') => {
    if (!serviceName || !apiKey) {
        toast({ variant: "destructive", title: "Missing fields", description: "Service name and API key are required." });
        return;
    }
    const existingKeyIndex = apiKeys.findIndex(k => k.serviceName.toLowerCase() === serviceName.toLowerCase());
    let updatedKeys;
    const newKeyEntry = { serviceName, apiKey, secretKey };

    if (existingKeyIndex > -1) {
      updatedKeys = apiKeys.map((k, index) => 
        index === existingKeyIndex ? newKeyEntry : k
      );
    } else {
      updatedKeys = [...apiKeys, newKeyEntry];
    }
    
    const success = await saveApiKeys(updatedKeys);
    if (success) {
      toast({ title: "API Key Saved", description: `API key for ${serviceName} has been ${existingKeyIndex > -1 ? 'updated' : 'added'}.` });
    }
  };

  const removeApiKey = async (serviceName) => {
    const updatedKeys = apiKeys.filter(k => k.serviceName.toLowerCase() !== serviceName.toLowerCase());
    const success = await saveApiKeys(updatedKeys);
    if (success) {
      toast({ title: "API Key Removed", description: `API key for ${serviceName} has been removed.` });
    }
  };

  return { apiKeys, addOrUpdateApiKey, removeApiKey, loading, refreshKeys: loadApiKeys };
};

export default useGenericApiKeys;