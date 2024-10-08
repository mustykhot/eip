import { useState } from "react";
import "./App.css";
import { useConnectWallet } from "./hooks/useConnectWallet";
import useAppContext from "./context";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const { getAccount, disconnectAccount } = useConnectWallet();

  const { account, chainId, error, isConnected } = useAppContext();

  const getBalanceFnc = async () => {
    if (inputValue) {
      console.log(inputValue, "inputValue");
      const provider = window.ethereum;
      try {
        const fetchedBalance = await provider.request({
          method: "eth_getBalance",
          params: [inputValue, "latest"],
        });
        console.log(fetchedBalance, "fetchedBalance");

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
          Balance for address {inputValue}: {accountBalance} eth
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
