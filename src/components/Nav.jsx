import React from 'react'
import { Link } from 'react-router-dom'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'

function Nav({account, loading}) {
  const [tonConnectUI] = useTonConnectUI();

  // Handler to log the connection URI when the button is clicked
  const handleTonConnectClick = () => {
    if (tonConnectUI && tonConnectUI.state && tonConnectUI.state.connectRequest) {
      // This is the connection URI for the QR code
      console.log('TonConnect QR URI:', tonConnectUI.state.connectRequest);
    } else {
      // Fallback: log the UI state for debugging
      console.log('TonConnect UI state:', tonConnectUI?.state);
    }
  };

  return (
   <>
    <div className="fixed z-10 backdrop-blur-sm">
      <section className="relative mx-auto">
          
        <nav className="flex justify-between text-white w-screen px-24">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center">
            <a className="text-3xl font-bold font-heading">
              Ignitus Networks
            </a>
           
            <ul className="md:flex px-4 mx-auto font-semibold font-heading space-x-7">
              <Link className='no-underline text-gray-200' as={Link} to="/">
                <li>Home</li>
              </Link>
              <Link className='no-underline text-gray-200' as={Link} to="/all-nft">
                <li>All NFTs</li>
              </Link>
              <Link className='no-underline text-gray-200' as={Link} to="/create">
                <li>Mint NFT</li>
              </Link>
            </ul>
            
            <div className="xl:flex items-center space-x-5">
              <div onClick={handleTonConnectClick} style={{ display: 'inline-block' }}>
              <TonConnectButton />
              </div>
            </div>
          </div>
        </nav>
        
      </section>
    </div>
   </>
  )
}

export default Nav