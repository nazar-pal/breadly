import React, { createContext, useContext, useState } from 'react';

export const currencies = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
];

type Currency = {
  symbol: string;
  code: string;
  name: string;
};

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: currencies[0],
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);