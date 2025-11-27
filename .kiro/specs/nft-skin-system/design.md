# Design Document

## Overview

The NFT Skin System adds collectible block skins to TetriChain. Players unlock skins by reaching score milestones, claim them as NFTs on the Sui blockchain, and trade them in a marketplace. The system also fixes the username registration to use on-chain storage.

## Architecture

### Frontend Components
- **CustomizationMenu**: UI for selecting and applying skins
- **SkinUnlockNotification**: Toast notification when milestones are reached
- **MarketplaceView**: Browse and trade skin NFTs
- **UsernamePrompt**: First-time registration modal

### Smart Contract Modules
- **skin_nft**: Manages skin NFT minting and metadata
- **marketplace**: Handles listing, buying, and canceling trades
- **username_registry**: Stores wallet-to-username mappings (already exists, needs integration)

### Data Flow
1. Player reaches milestone → Check unlock status → Show notification
2. Player claims skin → Call smart contract → Mint NFT → Update local state
3. Player lists NFT → Create marketplace listing → Escrow NFT
4. Player buys NFT → Transfer payment → Transfer NFT → Update inventories

## Components and Interfaces

### Skin Data Structure
```javascript
{
  id: number,           // Skin ID (1, 2, 3, etc.)
  name: string,         // "Neon Block", "Galaxy Block"
  unlockScore: number,  // Score required to unlock
  isUnlocked: boolean,  // Unlocked locally
  isClaimed: boolean,   // Minted as NFT
  nftId: string | null, // NFT object ID if claimed
  colors: string[]      // Block colors for this skin
}
```

### Smart Contract: Skin NFT
```move
struct SkinNFT has key, store {
    id: UID,
    skin_id: u64,        // Which skin (1=Neon, 2=Galaxy, etc.)
    name: String,
    minted_at: u64,
    owner: address
}
```

### Smart Contract: Marketplace Listing
```move
struct Listing has key {
    id: UID,
    nft_id: ID,
    seller: address,
    price: u64,
    listed_at: u64
}
```

## Data Models

### Local Storage
```javascript
{
  unlockedSkins: [1, 2],      // Array of unlocked skin IDs
  claimedSkins: [1],          // Array of claimed skin IDs
  selectedSkin: 1,            // Currently active skin
  username: "Player123"       // Cached username
}
```

### On-Chain State
- Username Registry: `address → username` mapping
- Skin NFTs: Owned by player wallets
- Marketplace Listings: Active trades with escrowed NFTs

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system.*

### Property 1: Milestone unlock consistency
*For any* player score, if the score >= unlockScore for a skin, then that skin should be marked as unlocked
**Validates: Requirements 2.1, 2.2, 2.3**

### Property 2: NFT uniqueness
*For any* claimed skin NFT, the token ID should be unique and never duplicated
**Validates: Requirements 3.3**

### Property 3: Marketplace atomicity
*For any* NFT purchase, either both the NFT transfer and payment succeed, or both fail (no partial transactions)
**Validates: Requirements 5.2, 5.3**

### Property 4: Username uniqueness
*For any* wallet address, there should be at most one registered username
**Validates: Requirements 6.2, 6.5**

### Property 5: Skin application persistence
*For any* selected skin, after page reload, the same skin should still be active
**Validates: Requirements 4.3**

## Error Handling

- **Milestone Check Failure**: Continue game, retry check on next score update
- **NFT Claim Failure**: Show error toast, allow retry, keep skin unlocked
- **Marketplace Transaction Failure**: Revert state, show error, refund if needed
- **Username Registration Failure**: Allow retry or continue with wallet address
- **Skin Load Failure**: Fall back to default skin

## Testing Strategy

### Unit Tests
- Test milestone detection logic with various scores
- Test skin unlock state management
- Test marketplace price calculations
- Test username validation

### Integration Tests
- Test full claim flow: unlock → claim → verify NFT
- Test marketplace flow: list → buy → verify ownership
- Test username flow: register → retrieve → display on leaderboard

### Manual Testing
- Play game to reach milestones and verify notifications
- Claim skins and verify on Sui Explorer
- List and buy skins in marketplace
- Register username and verify on leaderboard
