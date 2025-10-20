import { useContext } from "react";
import ConfigContext, { Config } from "./ConfigContext";

export const useConfig = (): Config => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
};

export default useConfig;
