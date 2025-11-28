# Requirements Document

## Introduction

The skin unlock system is currently broken because it only receives score data, but skins have unlock conditions based on multiple game statistics (level, lines cleared, tetris count, combo). This causes milestone notifications to never trigger and skins to incorrectly show as locked even when conditions are met.

## Glossary

- **Skin Unlock System**: The system that tracks which skins a player has unlocked based on game achievements
- **Game Stats**: The collection of statistics tracked during gameplay (score, level, lines cleared, tetris count, max combo)
- **Unlock Condition**: The specific requirement that must be met to unlock a skin (e.g., reach level 5, clear 50 lines)
- **Milestone Notification**: A visual notification shown when a player unlocks a new skin
- **useSkinUnlocks Hook**: The React hook that manages skin unlock state and notifications

## Requirements

### Requirement 1

**User Story:** As a player, I want the skin unlock system to track all my game statistics, so that skins unlock correctly based on their conditions.

#### Acceptance Criteria

1. WHEN the game state updates THEN the system SHALL pass all relevant game statistics (score, level, linesCleared, tetrisCount, maxCombo) to the skin unlock system
2. WHEN checking unlock conditions THEN the system SHALL use the appropriate statistic for each skin's unlock type
3. WHEN a skin has a level-based unlock condition THEN the system SHALL check the player's current level
4. WHEN a skin has a lines-based unlock condition THEN the system SHALL check the player's total lines cleared
5. WHEN a skin has a tetris-based unlock condition THEN the system SHALL check the player's tetris count

### Requirement 2

**User Story:** As a player, I want to see notifications when I unlock new skins, so that I know what I've achieved.

#### Acceptance Criteria

1. WHEN a player meets a skin's unlock condition for the first time THEN the system SHALL display a notification showing the unlocked skin
2. WHEN a notification is displayed THEN the system SHALL show the skin name and unlock condition that was met
3. WHEN a player unlocks multiple skins simultaneously THEN the system SHALL show notifications for each newly unlocked skin
4. WHEN a notification is shown THEN the system SHALL automatically dismiss it after a few seconds

### Requirement 3

**User Story:** As a player, I want unlocked skins to appear as available in the customization menu, so that I can select and use them.

#### Acceptance Criteria

1. WHEN viewing the customization menu THEN the system SHALL display all skins that meet their unlock conditions as unlocked
2. WHEN a skin's unlock condition is met THEN the system SHALL immediately mark it as unlocked in the customization menu
3. WHEN a skin is unlocked THEN the system SHALL persist the unlock state in local storage
4. WHEN the game loads THEN the system SHALL restore previously unlocked skins from local storage
5. WHEN checking if a skin is unlocked THEN the system SHALL verify the unlock condition using current game statistics
