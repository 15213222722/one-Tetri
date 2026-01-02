/**
 * TetriChain Configuration
 * 
 * This file contains all the blockchain configuration for the TetriChain game.
 * Update these values after deploying the smart contract.
 */

// OneChain Testnet Configuration (Sui-compatible)
export const NETWORK = 'onechain-testnet';
export const RPC_URL = 'https://rpc-testnet.onelabs.cc:443';

// WebSocket Server Configuration
export const WEBSOCKET_CONFIG = {
    serverUrl: import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3001',
};

// Deployed Contract Addresses (OneChain Testnet)
export const CONTRACT_CONFIG = {
    // Package ID - the deployed smart contract package
    packageId: '0x836714bf944d109f86498d4cb97cb9fdad70c7143398d7c5c6e1baf504f04ab9',
    
    // Shared Objects - required for transactions
    leaderboardId: '0x001a784efef4b920f3781224cef1ae58bd093f6537472cd65160aaf436c1bb4e',
    treasuryId: '0x49cebc2210c12ac24252b148b96da54add6fa8369272097b36d6d726ae7e28ec',
    usernameRegistryId: '0x290aede1d5904e2cae838d2d7e295cc0f9340d01657eeabef99a55738ed17e20',
    marketplaceId: '0xf17679c11a6939627cd0eee7ccd7bddede2024dc5fe8487c4cbb36acf0414670',
    
    // System Objects - Sui built-in objects 
    randomId: '0x8',  // Sui Random object
    clockId: '0x6',   // Sui Clock object
    
    // Module name
    moduleName: 'game',
    
    // Token Information
    token: {
        type: '0x836714bf944d109f86498d4cb97cb9fdad70c7143398d7c5c6e1baf504f04ab9::game::GAME',
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
