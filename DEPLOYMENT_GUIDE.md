# 🚀 TON Testnet Deployment Guide

## 📋 Your Details
- **Wallet Address**: `0QClyiq7oFeFwq9rSOJY5J0yYtARbi8y_y5ksdbX0ZbOZWnR`
- **Balance**: ~2 TON (sufficient for deployment)
- **Contract File**: `contracts/PayPerView.fc`
- **Network**: TON Testnet

## 🔧 Terminal Deployment Options

### Option 1: TON Center Web Interface (Recommended)
```bash
# Check your setup
npm run deploy:ton:curl

# Then visit: https://testnet.toncenter.com/
# Upload contracts/PayPerView.fc
# Deploy with 0.1 TON initial balance
```

### Option 2: Using TON Center API
```bash
# Check wallet balance
curl -s "https://testnet.toncenter.com/api/v2/getAddressBalance?address=0QClyiq7oFeFwq9rSOJY5J0yYtARbi8y_y5ksdbX0ZbOZWnR"

# Check network status
curl -s "https://testnet.toncenter.com/api/v2/getMasterchainInfo"
```

### Option 3: Manual FunC Compilation
```bash
# Install TON compiler (if available)
# git clone https://github.com/ton-blockchain/ton.git
# cd ton && mkdir build && cd build
# cmake .. && make -j4

# Compile contract
# func -o PayPerView.fif contracts/PayPerView.fc
```

## 📝 Available Scripts

```bash
# Check deployment status
npm run deploy:ton:curl

# Get deployment guide
npm run deploy:ton:web

# Check wallet balance
npm run deploy:ton:api
```

## 🎯 Quick Deployment Steps

1. **Check Setup**:
   ```bash
   npm run deploy:ton:curl
   ```

2. **Visit TON Center**:
   - Open: https://testnet.toncenter.com/
   - Connect wallet: `0QClyiq7oFeFwq9rSOJY5J0yYtARbi8y_y5ksdbX0ZbOZWnR`

3. **Upload Contract**:
   - Upload: `contracts/PayPerView.fc`
   - Set initial balance: 0.1 TON

4. **Deploy**:
   - Click "Deploy"
   - Copy contract address

5. **Update Config**:
   ```bash
   # Edit src/config.js
   # Update CONTRACT_ADDRESS with deployed address
   ```

6. **Run App**:
   ```bash
   npm start
   ```

## 📊 Contract Functions

- `upload_video(video_hash, thumbnail_hash, price, display_time)`
- `pay_to_view(video_id)`
- `can_view(video_id, user_address)`
- `get_videos()`

## 🔗 Useful Links

- **TON Center**: https://testnet.toncenter.com/
- **Block Explorer**: https://testnet.tonscan.org/
- **Your Wallet**: https://testnet.tonscan.org/address/0QClyiq7oFeFwq9rSOJY5J0yYtARbi8y_y5ksdbX0ZbOZWnR
- **TON Documentation**: https://docs.ton.org/

## ✅ Success Indicators

After deployment, you should see:
- ✅ Contract address starting with `EQD...`
- ✅ Transaction in wallet history
- ✅ Balance deduction for deployment fees
- ✅ Contract functions working in your app 