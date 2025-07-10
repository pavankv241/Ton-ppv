/**
 * Premium TON - PayPerView Video Platform
 * 
 * DSA CONCEPTS USED:
 * 1. State Management (React Hooks) - Array-based state updates
 * 2. Event Handling - Observer pattern for wallet events
 * 3. Provider Pattern - Dependency injection for blockchain connection
 * 4. Error Handling - Try-catch with specific error codes
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
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { toast } from 'react-toastify';
import { getContractInfo } from './utils/ton-transactions';

function App() {

  // STATE MANAGEMENT - Using React Hooks for component state
  // Time Complexity: O(1) for state updates
  // Space Complexity: O(1) per state variable
  const [loading, setLoading] = useState(true);
  const [marketplace, setMarketplace] = useState({});

  // TonConnect hooks
  const connectedAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  // EFFECT HOOK - Dependency-based side effects
  // Time Complexity: O(1) for comparison
  // Space Complexity: O(1) for state updates
  useEffect(() => {
    setLoading(true);
    
    const initializeApp = async () => {
      try {
        // Set up marketplace object for TON
        setMarketplace({
          ...getContractInfo(),
          tonConnectUI: tonConnectUI
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error initializing app:", error);
        toast.error("Failed to initialize app", {
          position: "top-center"
        });
        setLoading(false);
      }
    };

    initializeApp();
  }, [tonConnectUI]);

  // Handle wallet connection
  useEffect(() => {
    if (connectedAddress) {
      toast.success("TON wallet connected!", {
        position: "top-center"
      });
      console.log("Connected address:", connectedAddress);
    }
  }, [connectedAddress]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="App min-h-screen">
        <div className='gradient-bg-welcome h-screen w-screen'>
          <Nav account={connectedAddress} loading={loading} />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/all-nft" element={<NFTs marketplace={marketplace} account={connectedAddress} setMarketplace={setMarketplace} />}></Route>
            <Route path="/create" element={<Create marketplace={marketplace} account={connectedAddress} setMarketplace={setMarketplace} />}></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
