# Requirements Document

## Introduction

This document outlines the requirements for implementing an NFT-based skin system for TetriChain. Players unlock skins by reaching score milestones and can claim them as NFTs. The system also includes a marketplace for trading skins and fixes to the username system.

## Glossary

- **Skin**: A visual customization for Tetris blocks
- **NFT**: Non-fungible token representing ownership of a unique skin
- **Milestone**: A score threshold that unlocks a new skin
- **Claim**: The action of minting an unlocked skin as an NFT
- **Marketplace**: A platform where players can trade skin NFTs
- **Username Registry**: Smart contract storage for player usernames

## Requirements

### Requirement 1: Disable Multiplayer Feature

**User Story:** As a player, I should see a "Coming Soon" message when clicking multiplayer, so that I know the feature is not yet available.

#### Acceptance Criteria

1. WHEN a player clicks the multiplayer button THEN the system SHALL display a "Multiplayer Coming Soon" message
2. WHEN the message is displayed THEN the system SHALL prevent navigation to multiplayer screens

### Requirement 2: Milestone-Based Skin Unlocking

**User Story:** As a player, I want to unlock special skins by reaching score milestones, so that I can customize my game and earn collectibles.

#### Acceptance Criteria

1. WHEN a player reaches score 1,000 THEN the system SHALL unlock the "Neon Block" skin
2. WHEN a player reaches score 5,000 THEN the system SHALL unlock the "Galaxy Block" skin
3. WHEN a player reaches score 10,000 THEN the system SHALL unlock the "Diamond Block" skin
4. WHEN a skin is unlocked THEN the system SHALL display a notification to the player
5. WHEN a skin is unlocked THEN the system SHALL store the unlock status locally

### Requirement 3: NFT Claiming System

**User Story:** As a player, I want to claim my unlocked skins as NFTs, so that I can own them on the blockchain and trade them.

#### Acceptance Criteria

1. WHEN a player views unlocked skins THEN the system SHALL display a "Claim as NFT" button for each unclaimed skin
2. WHEN a player clicks "Claim as NFT" THEN the system SHALL mint an NFT on the Sui blockchain
3. WHEN an NFT is minted THEN the system SHALL assign a unique token ID to the skin
4. WHEN an NFT is claimed THEN the system SHALL mark the skin as claimed and remove the claim button
5. WHEN claiming fails THEN the system SHALL display an error message and allow retry

### Requirement 4: Skin Customization

**User Story:** As a player, I want to select and apply different skins to my Tetris blocks, so that I can personalize my gameplay experience.

#### Acceptance Criteria

1. WHEN a player opens the customization menu THEN the system SHALL display all unlocked skins
2. WHEN a player selects a skin THEN the system SHALL apply it to the game blocks immediately
3. WHEN a skin is applied THEN the system SHALL persist the selection across game sessions
4. WHEN a player owns an NFT skin THEN the system SHALL display it in the customization menu

### Requirement 5: NFT Marketplace

**User Story:** As a player, I want to trade skin NFTs with other players, so that I can collect rare skins or sell duplicates.

#### Acceptance Criteria

1. WHEN a player lists a skin NFT THEN the system SHALL create a marketplace listing with a price
2. WHEN another player purchases a listed NFT THEN the system SHALL transfer ownership and payment
3. WHEN a marketplace transaction completes THEN the system SHALL update both players' inventories
4. WHEN viewing the marketplace THEN the system SHALL display all available skin NFTs with prices
5. WHEN a player cancels a listing THEN the system SHALL return the NFT to their inventory

### Requirement 6: Username System Fix

**User Story:** As a first-time player, I want to register a username that is stored on-chain, so that my identity persists and appears on the leaderboard.

#### Acceptance Criteria

1. WHEN a first-time user visits the website THEN the system SHALL prompt for username registration
2. WHEN a username is entered THEN the system SHALL store it in the smart contract username registry
3. WHEN a returning user visits THEN the system SHALL retrieve their username from the contract
4. WHEN displaying the leaderboard THEN the system SHALL show usernames instead of wallet addresses
5. WHEN a username is already registered THEN the system SHALL skip the registration prompt
6. WHEN username registration fails THEN the system SHALL allow the player to retry or continue with address

### Requirement 7: Smart Contract Integration

**User Story:** As a developer, I need smart contract functions for skins and usernames, so that the system can operate on-chain.

#### Acceptance Criteria

1. WHEN minting a skin NFT THEN the contract SHALL create a unique token with skin metadata
2. WHEN listing an NFT THEN the contract SHALL escrow the token until sale or cancellation
3. WHEN purchasing an NFT THEN the contract SHALL transfer token and payment atomically
4. WHEN registering a username THEN the contract SHALL store the wallet-to-username mapping
5. WHEN querying a username THEN the contract SHALL return the registered name for a wallet address
