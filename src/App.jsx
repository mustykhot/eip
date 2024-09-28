import { useState } from "react";
import "./App.css";
import { useConnectWallet } from "./hooks/useConnectWallet";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const {
    account,
    chainId,
    isConnected,
    error,
    getAccount,
    disconnectAccount,
  } = useConnectWallet();

  const getBalanceFnc = async () => {
    if (inputValue) {
      const provider = window.ethereum;
      try {
        const fetchedBalance = await provider.request({
          method: "eth_getBalance",
          params: [inputValue, "latest"],
        });

        const formattedBalance = Number(fetchedBalance) / 1e18;
        setAccountBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching balance for input address:", error);
        setAccountBalance("");
      }
    } else {
      console.error("Enter address to get balance.");
      window.alert("Enter valid address");
    }
  };

  return (
    <div>
      <div className="cover_balance">
        <div className="d-flex">
          <input
            type="text"
            placeholder="Input address"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={getBalanceFnc}>Get Balance</button>
        </div>
        <h3 className="balance">
          Balance for address {inputValue}:{" "}
          {accountBalance ? `${accountBalance} eth` : "Enter address"}
        </h3>
      </div>

      <div className="coverconnect">
        {!isConnected ? (
          <button onClick={getAccount} className="enableEthereumButton">
            Connect
          </button>
        ) : (
          <>
            <h2>Account: {account}</h2>
            {chainId && <h3>Connected to Network: {chainId}</h3>}
            <button onClick={disconnectAccount} className="disconnectButton">
              Disconnect
            </button>
          </>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default App;
