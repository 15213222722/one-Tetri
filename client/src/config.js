/**
 * TetriChain Configuration
 * 
 * This file contains all the blockchain configuration for the TetriChain game.
 * Update these values after deploying the smart contract.
 */

// Sui Network Configuration
export const NETWORK = 'testnet';
export const RPC_URL = 'https://fullnode.testnet.sui.io:443';

// WebSocket Server Configuration
export const WEBSOCKET_CONFIG = {
    serverUrl: import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3001',
};

// Deployed Contract Addresses
export const CONTRACT_CONFIG = {
    // Package ID - the deployed smart contract package (Updated with NFT Skin System)
    packageId: '0x9fb6a73cd68dfb1821ab456982e6c9256546a8ecd29cd14bd7b803a2e3c9eb37',
    
    // Shared Objects - required for transactions
    leaderboardId: '0x7a172b5b34966a3efb437402bb1ad3c1e112e01466f297f730deec23c56f53ac',
    treasuryId: '0x66e95c3bf2cc405afd12e5c68c11f974eb099cc1f90a26d7b2f87cc7641d3bd7',
    usernameRegistryId: '0x27ec11dacbb79fc0de4f9dfacb2220ed941ae97a12c9bb504cbcf3954c267351',
    marketplaceId: '0x945b30973e865aa12e4b8aea43163b195e00b73565376caaab4c151b8e4214be',
    
    // System Objects - Sui built-in objects
    randomId: '0x8',  // Sui Random object
    clockId: '0x6',   // Sui Clock object
    
    // Module name
    moduleName: 'game',
    
    // Token Information
    token: {
        type: '0x9fb6a73cd68dfb1821ab456982e6c9256546a8ecd29cd14bd7b803a2e3c9eb37::game::GAME',
        symbol: 'TETRI',
        name: 'TetriChain Token',
        decimals: 0,  // Token has no decimals - raw balance is display balance
    }
};

// Transaction Configuration
export const TX_CONFIG = {
    // Gas budget for transactions (in MIST, 1 SUI = 1,000,000,000 MIST)
    createSeedGasBudget: 10_000_000,      // 0.01 SUI
    submitScoreGasBudget: 20_000_000,     // 0.02 SUI
    queryGasBudget: 5_000_000,            // 0.005 SUI
};

// Game Configuration
export const GAME_CONFIG = {
    // Score validation
    maxScore: 999_999,
    minScore: 0,
    
    // Token reward formula: tokens = score / 100
    tokenRewardDivisor: 100,
    
    // Leaderboard
    leaderboardSize: 10,
};

// Explorer URLs
export const EXPLORER_URL = 'https://testnet.suivision.xyz';

export function getPackageUrl() {
    return `${EXPLORER_URL}/package/${CONTRACT_CONFIG.packageId}`;
}

export function getObjectUrl(objectId) {
    return `${EXPLORER_URL}/object/${objectId}`;
}

export function getTxUrl(txDigest) {
    return `${EXPLORER_URL}/txblock/${txDigest}`;
}

export function getAddressUrl(address) {
    return `${EXPLORER_URL}/account/${address}`;
}
