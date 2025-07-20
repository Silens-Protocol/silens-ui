# Silens Frontend

A modern, decentralized web application for AI model safety assessment and community-driven governance. Built with Next.js, RainbowKit, and Wagmi for seamless Web3 integration.

## 🎯 Overview

Silens Frontend is the user interface for the Silens protocol - a decentralized platform where users can:

- **Submit AI Models** for community review and safety assessment
- **Review Models** with detailed analysis and severity ratings
- **Participate in Governance** through voting on model proposals
- **Build Reputation** through active participation and quality contributions
- **Verify Identity** through social platform integration

## ✨ Features

### 🔐 Web3 Integration
- **Wallet Connection**: Seamless wallet integration with RainbowKit
- **Multi-chain Support**: Currently configured for BSC Testnet
- **Smart Contract Interaction**: Direct interaction with Silens smart contracts
- **Transaction Management**: Built-in transaction handling and notifications

### 🎨 User Interface
- **Modern Design**: Clean, responsive UI built with Bootstrap and SCSS
- **Interactive Components**: Rich UI components with animations

### 📱 Core Functionality
- **Model Submission**: Upload AI models with metadata and images
- **Model Exploration**: Browse and search submitted models
- **Review System**: Submit detailed reviews with evidence
- **Governance Voting**: Participate in proposal voting
- **Profile Management**: User profiles with reputation tracking
- **Identity Verification**: Social platform verification system

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Bootstrap 5 + SCSS
- **Web3**: Wagmi + RainbowKit + Viem
- **State Management**: React Query (TanStack Query)
- **UI Components**: React Bootstrap, Lucide React Icons
- **API Integration**: REST API for data fetching
- **Animations**: React Type Animation, Tiny Slider

### Project Structure
```
silens-ui/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── explore/         # Model exploration pages
│   │   ├── profile/         # User profile pages
│   │   ├── submit/          # Model submission pages
│   │   ├── signup/          # User registration pages
│   │   └── api/             # API routes
│   ├── components/          # Reusable React components
│   │   ├── home/           # Homepage components
│   │   ├── explore/        # Exploration components
│   │   ├── submit/         # Submission components
│   │   ├── profile/        # Profile components
│   │   └── signup/         # Registration components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── contracts/          # Smart contract ABIs
│   ├── constants/          # Application constants
│   └── assets/             # Static assets (CSS, fonts, icons)
├── public/                 # Public static files
└── package.json           # Dependencies and scripts
```

## 🔗 Integration

### Smart Contracts
The frontend integrates with the following Silens smart contracts:
- **Silens** (Main Orchestrator): `0xCA18A11ca8e44c9eef603242Ef3cc92EE8BE12C2`
- **IdentityRegistry**: `0x5EF386D8aF3b1709C4Ca0404A27E80B2d1206e38`
- **ModelRegistry**: `0xEFEE9654334eE89A25021903B01AD840C7494dE2`
- **ReputationSystem**: `0x8C0028B38c492A2F991dD805093C6712344D012F`
- **VotingProposal**: `0x0e6c055996E02b129B8b4d7cCE9210997e408c7E`

### Indexer API
The frontend connects to the Silens Indexer for:
- Model data and metadata
- User profiles and reputation
- Governance proposals and votes
- Real-time updates

### Data Storage
- Model metadata and images (handled by indexer)
- Review evidence and screenshots (handled by indexer)
- User profile data (handled by indexer)
- Identity verification documents (handled by indexer)


## 🔒 Security Features

- **Wallet Verification**: Secure wallet connection
- **Transaction Signing**: User-controlled transactions
- **API Validation**: Data integrity checks
- **Input Sanitization**: XSS prevention
- **Environment Variables**: Secure configuration management

## 🔗 Links

- **Live Demo**: [Silens Platform](https://silens.up.railway.app)
- **Smart Contracts**: [BSCScan Testnet](https://testnet.bscscan.com/address/0xCA18A11ca8e44c9eef603242Ef3cc92EE8BE12C2)
