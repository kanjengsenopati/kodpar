
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type BusinessTab = 'koperasi' | 'retail' | 'manufaktur';

interface BusinessTabContextType {
  activeTab: BusinessTab;
  setActiveTab: (tab: BusinessTab) => void;
}

const BusinessTabContext = createContext<BusinessTabContextType>({
  activeTab: 'koperasi',
  setActiveTab: () => {},
});

export function BusinessTabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<BusinessTab>('koperasi');
  return (
    <BusinessTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </BusinessTabContext.Provider>
  );
}

export function useBusinessTab() {
  return useContext(BusinessTabContext);
}
