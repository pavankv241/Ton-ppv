import React from 'react'
import { Link } from 'react-router-dom'
import { TonConnectButton } from '@tonconnect/ui-react'

function Nav({account, loading}) {
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
              <TonConnectButton />
            </div>
          </div>
        </nav>
        
      </section>
    </div>
   </>
  )
}

export default Nav