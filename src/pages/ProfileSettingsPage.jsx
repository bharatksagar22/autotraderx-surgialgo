import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProfileInformationCard from '@/components/settings/ProfileInformationCard';
import BrokerApiKeysCard from '@/components/settings/BrokerApiKeysCard';
import HistoricalDataApiKeysCard from '@/components/settings/HistoricalDataApiKeysCard';
import AiAgentConfigCard from '@/components/settings/AiAgentConfigCard';
import NotificationPreferencesCard from '@/components/settings/NotificationPreferencesCard';
import useGenericApiKeys from '@/hooks/useBrokerApiKeys';

const ProfileSettingsPage = () => {
  const { user } = useAuth();

  const { addOrUpdateApiKey: addOrUpdateHistoricalApiKey, apiKeys: historicalApiKeys, loading: historicalApiKeysLoading } = useGenericApiKeys('smartTraderHistoricalDataApiKeys');
  const { addOrUpdateApiKey: addOrUpdateBrokerApiKey, apiKeys: brokerApiKeys, loading: brokerApiKeysLoading } = useGenericApiKeys('smartTraderBrokerApiKeys');
  
  useEffect(() => {
    // Auto-populate keys if not already present
    const predefinedHistoricalKey = {
      serviceName: "DefaultHistoricalProvider",
      apiKey: "6K5KdGas",
      secretKey: "b541bb5c-d8fa-4667-b592-2e00f6750722"
    };
    const predefinedBrokerKey = {
      serviceName: "DefaultTradingBroker",
      apiKey: "id1UIYy6",
      secretKey: "e8ab245c-de79-4b44-acb8-c46f9d04d390"
    };

    if (!historicalApiKeysLoading && !historicalApiKeys.find(k => k.apiKey === predefinedHistoricalKey.apiKey)) {
      addOrUpdateHistoricalApiKey(predefinedHistoricalKey.serviceName, predefinedHistoricalKey.apiKey, predefinedHistoricalKey.secretKey);
    }

    if (!brokerApiKeysLoading && !brokerApiKeys.find(k => k.apiKey === predefinedBrokerKey.apiKey)) {
      addOrUpdateBrokerApiKey(predefinedBrokerKey.serviceName, predefinedBrokerKey.apiKey, predefinedBrokerKey.secretKey);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historicalApiKeysLoading, brokerApiKeysLoading]);


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

  if (!user) {
    return <div className="text-center p-8">Loading user data...</div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-8 max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      
      <ProfileInformationCard user={user} />
      <BrokerApiKeysCard />
      <HistoricalDataApiKeysCard />
      <AiAgentConfigCard />
      <NotificationPreferencesCard />
      
    </motion.div>
  );
};

export default ProfileSettingsPage;