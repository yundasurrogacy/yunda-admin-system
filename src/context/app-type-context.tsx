"use client"
import React, { createContext, useContext, useState } from "react";

export type AppType = "admin" | "manager" | "client-manager" | "client" | "surrogacy";

interface AppTypeContextType {
  appType: AppType;
  setAppType: (type: AppType) => void;
}

const AppTypeContext = createContext<AppTypeContextType | undefined>(undefined);

export const AppTypeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appType, setAppType] = useState<AppType>("client");
  return (
    <AppTypeContext.Provider value={{ appType, setAppType }}>
      {children}
    </AppTypeContext.Provider>
  );
};

export const useAppType = () => {
  const context = useContext(AppTypeContext);
  if (!context) {
    throw new Error("useAppType must be used within an AppTypeProvider");
  }
  return context;
};
