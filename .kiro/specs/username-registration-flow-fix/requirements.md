# Requirements Document

## Introduction

This specification addresses the username registration flow timing issue where authentication success messages appear before the username registration modal is shown. The system should properly sequence wallet connection, username verification, and authentication confirmation.

## Glossary

- **Wallet Connection**: The process of connecting a blockchain wallet (e.g., OneWallet) to the application
- **Username Verification**: Checking if the connected wallet address has an associated username in localStorage or blockchain
- **Authentication Flow**: The complete sequence from wallet connection through username registration to menu access
- **Loading State**: Visual feedback shown to users during asynchronous operations
- **Username Registration Modal**: UI component that prompts users to create a username

## Requirements

### Requirement 1

**User Story:** As a user, I want to see appropriate loading feedback when connecting my wallet, so that I understand the system is checking my username status.

#### Acceptance Criteria

1. WHEN a user clicks a wallet option in the wallet selection modal THEN the system SHALL display a loading indicator immediately
2. WHEN the wallet connection is being established THEN the system SHALL show "Connecting wallet..." message
3. WHEN the username verification is in progress THEN the system SHALL show "Checking username registration..." message
4. WHEN loading states change THEN the system SHALL update the loading message without showing success messages prematurely

### Requirement 2

**User Story:** As a user, I want the system to verify my username before showing any success messages, so that I complete registration before accessing the application.

#### Acceptance Criteria

1. WHEN a wallet successfully connects THEN the system SHALL immediately check for an existing username
2. WHEN no username exists for the connected wallet THEN the system SHALL display the username registration modal
3. WHEN the username registration modal is displayed THEN the system SHALL NOT show "Authentication successful" message
4. WHEN username verification completes THEN the system SHALL transition to the appropriate screen based on username existence

### Requirement 3

**User Story:** As a user, I want to see "Authentication successful" only after I have completed username registration, so that the message accurately reflects my authentication status.

#### Acceptance Criteria

1. WHEN a user completes username registration THEN the system SHALL show "Authentication successful" message
2. WHEN a user has an existing username and wallet connects THEN the system SHALL show "Authentication successful" message
3. WHEN username verification is still in progress THEN the system SHALL NOT show any success messages
4. WHEN authentication is complete THEN the system SHALL navigate to the main menu

### Requirement 4

**User Story:** As a user, I want the loading overlay to remain visible during the entire authentication flow, so that I know the system is processing my request.

#### Acceptance Criteria

1. WHEN wallet connection begins THEN the system SHALL display the loading overlay
2. WHEN username verification is in progress THEN the system SHALL keep the loading overlay visible
3. WHEN the username registration modal appears THEN the system SHALL hide the loading overlay
4. WHEN authentication completes successfully THEN the system SHALL hide the loading overlay and show success message
5. WHILE the loading overlay is visible THEN the system SHALL prevent user interaction with other UI elements
