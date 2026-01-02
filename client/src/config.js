/**
 * TetriChain Configuration
 * 
 * This file contains all the blockchain configuration for the TetriChain game.
 * Update these values after deploying the smart contract.
 */

// OneChain Testnet Configuration (Sui-compatible)
export const NETWORK = import.meta.env.VITE_NETWORK;
export const RPC_URL = import.meta.env.VITE_RPC_URL;

// WebSocket Server Configuration
export const WEBSOCKET_CONFIG = {
    serverUrl: import.meta.env.VITE_SOCKET_SERVER_URL,
};

// Deployed Contract Addresses (OneChain Testnet)
export const CONTRACT_CONFIG = {
    // Package ID - the deployed smart contract package
    packageId: import.meta.env.VITE_PACKAGE_ID || '',
    
    // Shared Objects - required for transactions
    leaderboardId: import.meta.env.VITE_LEADERBOARD_ID || '',
    treasuryId: import.meta.env.VITE_TREASURY_ID || '',
    usernameRegistryId: import.meta.env.VITE_USERNAME_REGISTRY_ID || '',
    marketplaceId: import.meta.env.VITE_MARKETPLACE_ID || '',

    // System Objects - Sui built-in objects
    randomId: import.meta.env.VITE_RANDOM_ID || '0x8',  // Sui Random object
    clockId: import.meta.env.VITE_CLOCK_ID || '0x6',   // Sui Clock object

    // Module name
    moduleName: 'game',
    
    // Token Information
    token: {
        type: `${import.meta.env.VITE_PACKAGE_ID}::game::GAME`,
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
export const EXPLORER_URL = 'https://explorer.onelabs.cc';

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
