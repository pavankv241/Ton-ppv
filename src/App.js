/**
 * Premium Zora - PayPerView Video Platform
 * 
 * DSA CONCEPTS USED:
 * 1. State Management (React Hooks) - Array-based state updates
 * 2. Event Handling - Observer pattern for wallet events
 * 3. Network Switching Algorithm - Recursive chain switching with fallback
 * 4. Provider Pattern - Dependency injection for blockchain connection
 * 5. Error Handling - Try-catch with specific error codes
 */

import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import NFTs from './components/NFTs';
import Create from './components/Create';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { toast } from 'react-toastify'
import { ethers } from 'ethers';
import { 
  CONTRACT_ADDRESS, 
  CONTRACT_ABI, 
  NETWORK_CONFIG, 
  getContract, 
  connectWallet 
} from './contractConfig';

function App() {

  // STATE MANAGEMENT - Using React Hooks for component state
  // Time Complexity: O(1) for state updates
  // Space Complexity: O(1) per state variable
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [marketplace, setMarketplace] = useState({});
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [chainId, setChainId] = useState(null)
  const correctChainId = NETWORK_CONFIG.chainId;
  

  // EVENT HANDLING - Observer Pattern for blockchain events
  // Time Complexity: O(1) for event registration
  // Space Complexity: O(1) for event listeners
  window.ethereum.on("chainChanged", (newChain) => {
    setChainId(newChain);
    console.log(newChain);
    console.log(chainId);
    window.location.href = "/"; // Redirect using window.location
  });

  window.ethereum.on("accountsChanged", () => {
    window.location.href = "/"; // Redirect using window.location
  });

  // NETWORK SWITCHING ALGORITHM - Recursive with fallback handling
  // Time Complexity: O(1) average case, O(n) worst case (recursive calls)
  // Space Complexity: O(n) due to recursive call stack
  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: correctChainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Chain not added, add it - Recursive fallback
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG],
          });
          return await switchNetwork(); // Recursive call
        } catch (addError) {
          toast.error("Failed to add Zora Sepolia Testnet to MetaMask", {
            position: "top-center"
          });
        }
      } else {
        toast.error((
          <div>Some error occurred while switching network <br/> Please switch to Zora Sepolia Testnet</div>
        ), {
          position: "top-center"
        });
      }
      console.log(error);
    }
  }

  // EFFECT HOOK - Dependency-based side effects
  // Time Complexity: O(1) for comparison
  // Space Complexity: O(1) for state updates
  useEffect(() => {
    if (chainId !== correctChainId) {
      console.log("curr chain: " + chainId);
      setCorrectNetwork(false);
      switchNetwork()
    } else if (chainId === correctChainId) {
      console.log("curr chain: " + chainId);
      setCorrectNetwork(true);
    }
  }, [chainId, correctChainId])

  // PROVIDER INITIALIZATION - Dependency injection pattern
  // Time Complexity: O(1) for provider creation
  // Space Complexity: O(1) for provider instance
  useEffect(() => {
    setLoading(true)
    const loadProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // PROVIDER PATTERN - Dependency injection for blockchain connection
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const address = await connectWallet();
          setAccount(address);
          
          const marketplacecontract = await getContract(true);
          console.log("Marketplace contract initialized:", marketplacecontract);
          console.log("Contract address:", marketplacecontract.address);
          console.log("Contract functions:", Object.keys(marketplacecontract.functions));
          setMarketplace(marketplacecontract);
          
          const network = await provider.getNetwork();
          setChainId(network.chainId.toString());
          console.log("Chain ID:", network.chainId.toString());
          
          if (network.chainId.toString() === correctChainId) {
            setCorrectNetwork(true);
          }
          
          setLoading(false);
        } catch (error) {
          console.error("Error loading provider:", error);
          toast.error("Failed to connect wallet", {
            position: "top-center"
          });
          setLoading(false);
        }
      } else {
        console.error("Metamask is not installed");
        toast.error("Please install MetaMask", {
          position: "top-center"
        });
        setLoading(false);
      }
    };

    loadProvider();
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="App min-h-screen">
        <div className='gradient-bg-welcome h-screen w-screen'>
          <Nav account={account} loading={loading} />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/all-nft" element={<NFTs marketplace={marketplace} account={account} setMarketplace={setMarketplace} />}></Route>
            <Route path="/create" element={<Create marketplace={marketplace} account={account} setMarketplace={setMarketplace} />}></Route>
          </Routes>
        </div>
      </div>

    </BrowserRouter>
  );
}

export default App;
