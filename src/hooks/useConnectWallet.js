import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

export const useConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const getAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      if (error.code === 4001) {
        setError("connect to MetaMask.");
      } else {
        setError("There was an error  while connecting to MetaMask.");
      }
    }
  };

  const disconnectAccount = () => {
    setAccount(null);
    setIsConnected(false);
    setError("");
  };

  const handleChainChanged = (newChainId) => {
    setChainId(newChainId);
    window.location.reload();
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setAccount(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    const setup = async () => {
      const provider = await detectEthereumProvider();
      if (provider && provider === window.ethereum) {
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setChainId(currentChainId);

        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      } else {
        setError("You don't have MetaMask not installed.");
      }
    };
    setup();

    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  return {
    account,
    chainId,
    isConnected,
    error,
    getAccount,
    disconnectAccount,
  };
};
