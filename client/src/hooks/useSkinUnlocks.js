import { useState, useEffect, useCallback } from 'react';
import { SKINS, getUnlockedSkins } from '../skinConfig.js';

/**
 * Hook to manage skin unlocks based on game statistics
 */
export function useSkinUnlocks(gameStats) {
    const [unlockedSkins, setUnlockedSkins] = useState(() => {
        // Load from localStorage on mount
        const saved = localStorage.getItem('unlockedSkins');
        return saved ? JSON.parse(saved) : [0]; // Classic skin (id: 0) is always unlocked
    });

    const [newlyUnlocked, setNewlyUnlocked] = useState(null);

    // Extract stats with defaults
    const { 
        score = 0, 
        level = 1, 
        linesCleared = 0, 
        tetrisCount = 0, 
        maxCombo = 0 
    } = gameStats || {};

    // Check for newly unlocked skins when game stats change
    useEffect(() => {
        // Skip if no valid stats
        if (!gameStats) return;

        const stats = { score, level, linesCleared, tetrisCount, maxCombo };
        const currentlyUnlocked = getUnlockedSkins(stats);
        const newUnlocks = currentlyUnlocked.filter(
            skin => !unlockedSkins.includes(skin.id)
        );

        if (newUnlocks.length > 0) {
            // Add newly unlocked skins
            const updatedUnlocks = [...unlockedSkins, ...newUnlocks.map(s => s.id)];
            setUnlockedSkins(updatedUnlocks);
            
            try {
                localStorage.setItem('unlockedSkins', JSON.stringify(updatedUnlocks));
            } catch (error) {
                console.error('Failed to save unlocked skins to localStorage:', error);
            }

            // Show notification for the first newly unlocked skin
            setNewlyUnlocked(newUnlocks[0]);
        }
    }, [score, level, linesCleared, tetrisCount, maxCombo, unlockedSkins]);

    // Clear notification
    const clearNotification = useCallback(() => {
        setNewlyUnlocked(null);
    }, []);

    // Check if a specific skin is unlocked
    const isSkinUnlocked = useCallback((skinId) => {
        return unlockedSkins.includes(skinId);
    }, [unlockedSkins]);

    // Get all unlocked skin objects
    const getUnlockedSkinObjects = useCallback(() => {
        return SKINS.filter(skin => unlockedSkins.includes(skin.id));
    }, [unlockedSkins]);

    return {
        unlockedSkins,
        newlyUnlocked,
        clearNotification,
        isSkinUnlocked,
        getUnlockedSkinObjects,
    };
}
