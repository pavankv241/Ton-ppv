# Zora Premium - TON Pay-Per-View Platform

A pay-per-view video platform built on TON blockchain using TACT language and TypeScript.

## 🏗️ Project Structure

```
Zora-Premium/
├── contracts/          # TACT smart contracts
│   └── PayPerView.tact
├── wrappers/           # TypeScript contract wrappers
│   └── PayPerView.ts
├── tests/              # TypeScript tests
│   └── PayPerView.test.ts
├── scripts/            # Deployment and utility scripts
│   └── deploy.ts
├── src/                # React frontend
├── blueprint.toml      # TON Blueprint configuration
└── package.json        # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- TON wallet (mobile app)
- Testnet TON tokens

### Installation
```bash
npm install
```

### Build
```bash
npx blueprint build
```

### Test
```bash
npx blueprint test
```

### Deploy
```bash
npx blueprint run
```

## 📋 Features

### Smart Contract (TACT)
- **Pay-per-view video access**
- **Revenue collection and withdrawal**
- **Video metadata management**
- **Viewer tracking**
- **Owner-only administrative functions**

### Frontend (React + TypeScript)
- **Modern UI with Tailwind CSS**
- **TON wallet integration**
- **Video player with access control**
- **Real-time contract interaction**

## 🎯 Contract Functions

### For Viewers
- `purchase()` - Buy video access
- `getVideoInfo()` - Get video details
- `hasPurchased()` - Check purchase status

### For Content Creators
- `withdraw()` - Withdraw revenue
- `update_video()` - Update video details
- `toggle_active()` - Toggle video availability

## 🔧 Development

### Add New Contract
```bash
npx blueprint create ContractName
```

### Run Tests
```bash
npm run blueprint:test
```

### Build Contracts
```bash
npm run blueprint:build
```

### Deploy to Testnet
```bash
npm run deploy:ton
```

## 🌐 Networks

- **Testnet**: `https://testnet.toncenter.com/api/v2`
- **Mainnet**: `https://toncenter.com/api/v2`

## 💰 Wallet Configuration

- **Testnet Wallet**: `0QClyiq7oFeFwq9rSOJY5J0yYtARbi8y_y5ksdbX0ZbOZWnR`
- **Balance**: 2.00 TON (sufficient for deployment)

## 📚 Technologies

- **TACT** - Smart contract language
- **TypeScript** - Type-safe development
- **TON Blueprint** - Development framework
- **React** - Frontend framework
- **Tailwind CSS** - Styling
- **@ton/ton** - TON SDK

## 🔗 Useful Links

- [TON Documentation](https://ton.org/docs)
- [TACT Documentation](https://tact-lang.org)
- [TON Blueprint](https://github.com/ton-community/blueprint)
- [TON Testnet Explorer](https://testnet.tonscan.org)
- [TON Community](https://t.me/ton_blockchain)

## 📞 Support

- **TON Community**: @ton_blockchain
- **TACT Community**: @tact_lang
- **TON Developers**: @ton_developers

## 📄 License

MIT License - see LICENSE file for details.
