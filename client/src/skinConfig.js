/**
 * Skin Configuration
 * Defines all available skins and their unlock requirements
 */

export const SKINS = [
    {
        id: 0,
        name: 'Classic',
        unlockScore: 0,
        description: 'The original Tetris blocks',
        colors: {
            1: '#00f0f0', // I - Cyan
            2: '#f0f000', // O - Yellow
            3: '#a000f0', // T - Purple
            4: '#00f000', // S - Green
            5: '#f00000', // Z - Red
            6: '#0000f0', // J - Blue
            7: '#f0a000', // L - Orange
        }
    },
    {
        id: 1,
        name: 'Neon Block',
        unlockScore: 1000,
        description: 'Glowing neon colors for cyberpunk vibes',
        colors: {
            1: '#00ffff', // I - Bright Cyan
            2: '#ffff00', // O - Bright Yellow
            3: '#ff00ff', // T - Magenta
            4: '#00ff00', // S - Lime Green
            5: '#ff0066', // Z - Hot Pink
            6: '#0066ff', // J - Electric Blue
            7: '#ff6600', // L - Bright Orange
        }
    },
    {
        id: 2,
        name: 'Galaxy Block',
        unlockScore: 5000,
        description: 'Cosmic colors from distant galaxies',
        colors: {
            1: '#4a0e4e', // I - Deep Purple
            2: '#ffd700', // O - Gold
            3: '#8b00ff', // T - Violet
            4: '#00ced1', // S - Dark Turquoise
            5: '#ff1493', // Z - Deep Pink
            6: '#1e90ff', // J - Dodger Blue
            7: '#ff8c00', // L - Dark Orange
        }
    },
    {
        id: 3,
        name: 'Diamond Block',
        unlockScore: 10000,
        description: 'Precious gem-like blocks for elite players',
        colors: {
            1: '#b9f2ff', // I - Diamond Blue
            2: '#fffacd', // O - Lemon Chiffon
            3: '#dda0dd', // T - Plum
            4: '#98fb98', // S - Pale Green
            5: '#ffb6c1', // Z - Light Pink
            6: '#add8e6', // J - Light Blue
            7: '#ffdab9', // L - Peach Puff
        }
    }
];

/**
 * Get skin by ID
 */
export function getSkinById(id) {
    return SKINS.find(skin => skin.id === id) || SKINS[0];
}

/**
 * Get all unlocked skins for a given score
 */
export function getUnlockedSkins(score) {
    return SKINS.filter(skin => score >= skin.unlockScore);
}

/**
 * Check if a specific skin is unlocked
 */
export function isSkinUnlocked(skinId, score) {
    const skin = getSkinById(skinId);
    return skin && score >= skin.unlockScore;
}

/**
 * Get the next skin to unlock
 */
export function getNextSkinToUnlock(score) {
    const lockedSkins = SKINS.filter(skin => score < skin.unlockScore);
    return lockedSkins.length > 0 ? lockedSkins[0] : null;
}
