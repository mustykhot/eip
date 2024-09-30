import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppContextProvider(props) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  return (
    <AppContext.Provider
      value={{
        account,
        setAccount,
        chainId,
        setChainId,
        error,
        setError,
        isConnected,
        setIsConnected,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export default function useAppContext() {
  return useContext(AppContext);
}
