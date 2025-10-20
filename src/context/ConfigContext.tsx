import React, { createContext } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";

export type Config = {
  projectName: string;
  organization: string;
  boardName: string;
  setProjectName: (v: string) => void;
  setOrganization: (v: string) => void;
  setBoardName: (v: string) => void;
};

const { VITE_ORGANIZATION, VITE_BOARD_NAME, VITE_PROJECT_NAME } = import.meta
  .env;

const ConfigContext = createContext<Config | undefined>(undefined);

const storage = <T,>(key: string, defaultValue: T) => {
  const isDev = import.meta.env.DEV;
  if (isDev) return () => React.useState<T>(defaultValue);
  return () => useChromeStorageLocal<T>(key, defaultValue);
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projectName, setProjectName] = storage<string>(
    "projectName",
    VITE_PROJECT_NAME
  )();
  const [organization, setOrganization] = storage<string>(
    "organization",
    VITE_ORGANIZATION ?? ""
  )();
  const [boardName, setBoardName] = storage<string>(
    "boardName",
    VITE_BOARD_NAME ?? ""
  )();

  const value: Config = {
    projectName,
    organization,
    boardName,
    setProjectName,
    setOrganization,
    setBoardName,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export default ConfigContext;
