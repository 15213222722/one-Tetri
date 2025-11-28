# Design Document

## Overview

The skin unlock system fix addresses a critical bug where the unlock tracking only receives score data, preventing proper unlock detection for skins with level, lines, tetris, and combo-based conditions. The solution involves passing complete game statistics to the unlock hook and updating the unlock checking logic to properly evaluate all condition types.

## Architecture

The fix involves three main components:

1. **App.jsx** - Update to pass complete game stats object instead of just score
2. **useSkinUnlocks Hook** - Update to accept and process complete stats object
3. **skinConfig.js** - Already correctly implements multi-stat unlock checking (no changes needed)

The data flow is:
```
Game State (game.js) → App.jsx → useSkinUnlocks Hook → skinConfig.checkSkinUnlocked()
```

## Components and Interfaces

### Modified: App.jsx

**Current Implementation:**
```javascript
const skinUnlocks = useSkinUnlocks(game.gameState.score);
```

**Fixed Implementation:**
```javascript
const gameStats = {
    score: game.gameState.score,
    level: game.gameState.level,
    linesCleared: game.gameState.linesCleared,
    tetrisCount: game.gameState.tetrisCount,
    maxCombo: game.gameState.maxCombo
};
const skinUnlocks = useSkinUnlocks(gameStats);
```

### Modified: useSkinUnlocks Hook

**Function Signature Change:**
```javascript
// Before
export function useSkinUnlocks(currentScore)

// After
export function useSkinUnlocks(gameStats)
```

**Updated Logic:**
- Accept `gameStats` object instead of `currentScore`
- Pass complete stats to `getUnlockedSkins()` and `checkSkinUnlocked()`
- Update useEffect dependency from `currentScore` to `gameStats`
- Use deep comparison or individual stat dependencies to avoid unnecessary re-renders

### Unchanged: skinConfig.js

The `checkSkinUnlocked()` and `getUnlockedSkins()` functions already correctly handle all stat types. No changes needed.

## Data Models

### GameStats Object
```javascript
{
    score: number,        // Total score
    level: number,        // Current level (1-based)
    linesCleared: number, // Total lines cleared
    tetrisCount: number,  // Number of 4-line clears
    maxCombo: number      // Highest combo achieved
}
```

### Unlock Condition Types
```javascript
{
    type: 'default' | 'score' | 'level' | 'lines' | 'tetris' | 'combo',
    value: number,
    description?: string
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Complete stats propagation
*For any* game state update, all five statistics (score, level, linesCleared, tetrisCount, maxCombo) should be passed to the useSkinUnlocks hook
**Validates: Requirements 1.1**

### Property 2: Correct unlock detection
*For any* skin with a specific unlock condition type, the system should check the corresponding statistic from the game stats object
**Validates: Requirements 1.2, 1.3, 1.4, 1.5**

### Property 3: Notification on first unlock
*For any* skin that transitions from locked to unlocked state, a notification should be displayed exactly once
**Validates: Requirements 2.1**

### Property 4: Unlock persistence
*For any* unlocked skin, the unlock state should persist across page reloads via localStorage
**Validates: Requirements 3.3, 3.4**

### Property 5: Unlock state consistency
*For any* skin, the unlock state shown in the customization menu should match the result of checking the unlock condition against current game stats
**Validates: Requirements 3.1, 3.2, 3.5**

## Error Handling

### Missing Stats
- If any stat is undefined, default to 0
- Use destructuring with defaults: `const { score = 0, level = 1, ... } = gameStats || {}`

### Invalid Stats
- Negative values should be treated as 0
- Non-numeric values should be coerced to numbers or default to 0

### localStorage Failures
- Wrap localStorage operations in try-catch
- If read fails, default to classic skin only (id: 0)
- If write fails, log error but continue (unlock state will be lost on reload)

## Testing Strategy

### Unit Tests
- Test useSkinUnlocks hook with various game stat combinations
- Test that each unlock condition type correctly evaluates
- Test notification triggering on unlock transitions
- Test localStorage persistence and restoration

### Integration Tests
- Test complete flow from game state update to unlock notification
- Test that customization menu reflects correct unlock states
- Test that unlocks persist across simulated page reloads

### Manual Testing
- Play game and verify notifications appear at correct milestones
- Check customization menu shows correct unlock states
- Verify unlocks persist after page refresh
- Test each unlock condition type (score, level, lines, tetris, combo)

## Implementation Notes

### Performance Considerations
- Use `useMemo` to memoize gameStats object to prevent unnecessary re-renders
- Consider using individual stat values as useEffect dependencies instead of entire object
- Avoid deep equality checks if possible

### Backward Compatibility
- Existing localStorage data (unlocked skin IDs) remains compatible
- No migration needed for existing users

### Future Enhancements
- Add unlock progress indicators (e.g., "50/100 lines cleared")
- Add unlock history/achievement log
- Add sound effects for unlock notifications
