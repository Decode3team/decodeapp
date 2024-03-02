'use client';

import { DefinedNetworkModel } from '@/lib/defined/types';
import { createContext, useContext, useMemo, useState } from 'react';

type NetworkProviderContextType = {
  selectedNetwork: DefinedNetworkModel | null;
  setSelectedNetwork: (network: DefinedNetworkModel) => void;
};

const NetworkProviderContext = createContext<NetworkProviderContextType | null>(null);

export const useNetworkProvider = () => {
  const context = useContext(NetworkProviderContext);

  if (!context) {
    throw new Error('useNetworkProvider must be used within a NetworkProvider');
  }

  return context;
};

function NetworkProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const [selectedNetwork, setSelectedNetwork] = useState<DefinedNetworkModel | null>(null);

  const contextValue = useMemo(
    () => ({
      selectedNetwork,
      setSelectedNetwork,
    }),
    [selectedNetwork, setSelectedNetwork],
  );

  return (
    <NetworkProviderContext.Provider value={contextValue}>
      {children}
    </NetworkProviderContext.Provider>
  );
}

export default NetworkProviders;
