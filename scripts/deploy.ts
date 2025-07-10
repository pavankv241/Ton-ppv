import { Address, toNano } from '@ton/core';
import { TonClient, WalletContractV4, internal } from '@ton/ton';
import { PayPerView, PayPerViewConfig } from '../wrappers/PayPerView';

async function main() {
    console.log('🚀 Deploying PayPerView Contract to TON Testnet');
    console.log('===============================================\n');

    // Initialize TON client
    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2'
    });

    // Your wallet address
    const walletAddress = Address.parse('0QClyiq7oFeFwq9rSOJY5J0yYtARbi8y_y5ksdbX0ZbOZWnR');
    
    console.log('📋 Deployment Configuration:');
    console.log('Wallet Address:', walletAddress.toString());
    console.log('Network: TON Testnet');
    console.log('');

    // Contract configuration
    const contractConfig: PayPerViewConfig = {
        owner: walletAddress,
        videoPrice: toNano('0.1'), // 0.1 TON per view
        videoHash: 'QmPayPerViewVideoHash123456789',
        videoTitle: 'Premium Video Content',
        videoDescription: 'Exclusive pay-per-view video content on TON blockchain'
    };

    console.log('📄 Contract Configuration:');
    console.log('Owner:', contractConfig.owner.toString());
    console.log('Video Price:', contractConfig.videoPrice.toString(), 'nanoTONs');
    console.log('Video Hash:', contractConfig.videoHash);
    console.log('Video Title:', contractConfig.videoTitle);
    console.log('Video Description:', contractConfig.videoDescription);
    console.log('');

    try {
        // Create contract instance
        const contract = PayPerView.createFromConfig(contractConfig);
        
        console.log('✅ Contract created successfully');
        console.log('Contract Address:', contract.address.toString());
        console.log('');

        // Check wallet balance
        console.log('💰 Checking wallet balance...');
        const balance = await client.getBalance(walletAddress);
        console.log('Wallet Balance:', balance.toString(), 'nanoTONs');
        console.log('Wallet Balance:', (Number(balance) / 1000000000).toFixed(2), 'TON');
        
        if (balance < toNano('0.5')) {
            console.log('❌ Insufficient balance for deployment');
            console.log('💡 Fund your wallet via: https://t.me/testgiver_ton_bot');
            return;
        }

        console.log('✅ Sufficient balance for deployment');
        console.log('');

        // Deploy contract
        console.log('🚀 Deploying contract...');
        console.log('This will require confirmation in your mobile wallet');
        console.log('');

        // Note: This is a simplified deployment
        // In a real scenario, you would need to:
        // 1. Compile the TACT contract
        // 2. Get the contract code
        // 3. Send deployment transaction
        
        console.log('📝 Deployment Steps:');
        console.log('1. Compile TACT contract: npx blueprint build');
        console.log('2. Deploy contract: npx blueprint run');
        console.log('3. Confirm in mobile wallet');
        console.log('4. Save contract address');
        console.log('');

        console.log('🎯 Contract Features:');
        console.log('• Pay-per-view video access');
        console.log('• Revenue collection and withdrawal');
        console.log('• Video metadata management');
        console.log('• Viewer tracking');
        console.log('• Owner-only administrative functions');
        console.log('');

        console.log('📋 Next Steps:');
        console.log('1. Run: npx blueprint build');
        console.log('2. Run: npx blueprint run');
        console.log('3. Update frontend configuration');
        console.log('4. Test contract functionality');
        console.log('');

        console.log('🔗 Useful Links:');
        console.log('• TON Testnet Explorer: https://testnet.tonscan.org');
        console.log('• TON Documentation: https://ton.org/docs');
        console.log('• TACT Documentation: https://tact-lang.org');
        console.log('• TON Community: @ton_blockchain');

    } catch (error) {
        console.error('❌ Deployment failed:', error);
        console.log('');
        console.log('💡 Troubleshooting:');
        console.log('• Check wallet balance');
        console.log('• Verify network connection');
        console.log('• Ensure TACT contract is valid');
        console.log('• Contact TON community for help');
    }
}

main().catch(console.error); 