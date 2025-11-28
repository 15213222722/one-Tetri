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
        },
        unlockCondition: { type: 'default' }
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
        },
        unlockCondition: { type: 'score', value: 1000 }
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
        },
        unlockCondition: { type: 'score', value: 5000 }
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
        },
        unlockCondition: { type: 'score', value: 10000 }
    },
    {
        id: 4,
        name: 'Ocean Depths',
        unlockScore: 0,
        description: 'Deep sea blues and aquatic tones',
        colors: {
            1: '#006994', // I - Deep Ocean Blue
            2: '#008b8b', // O - Dark Cyan
            3: '#20b2aa', // T - Light Sea Green
            4: '#4682b4', // S - Steel Blue
            5: '#5f9ea0', // Z - Cadet Blue
            6: '#4169e1', // J - Royal Blue
            7: '#87ceeb', // L - Sky Blue
        },
        unlockCondition: { type: 'level', value: 5, description: 'Reach Level 5' }
    },
    {
        id: 5,
        name: 'Sunset Blaze',
        unlockScore: 0,
        description: 'Warm sunset and fire colors',
        colors: {
            1: '#ff4500', // I - Orange Red
            2: '#ff6347', // O - Tomato
            3: '#ff7f50', // T - Coral
            4: '#ffa500', // S - Orange
            5: '#ff8c00', // Z - Dark Orange
            6: '#ffd700', // J - Gold
            7: '#ffb347', // L - Sandy Brown
        },
        unlockCondition: { type: 'lines', value: 50, description: 'Clear 50 Lines' }
    },
    {
        id: 6,
        name: 'Forest Grove',
        unlockScore: 0,
        description: 'Natural green forest shades',
        colors: {
            1: '#228b22', // I - Forest Green
            2: '#32cd32', // O - Lime Green
            3: '#9acd32', // T - Yellow Green
            4: '#7cfc00', // S - Lawn Green
            5: '#00ff7f', // Z - Spring Green
            6: '#3cb371', // J - Medium Sea Green
            7: '#90ee90', // L - Light Green
        },
        unlockCondition: { type: 'lines', value: 100, description: 'Clear 100 Lines' }
    },
    {
        id: 7,
        name: 'Royal Purple',
        unlockScore: 0,
        description: 'Majestic purple and violet hues',
        colors: {
            1: '#4b0082', // I - Indigo
            2: '#663399', // O - Rebecca Purple
            3: '#8a2be2', // T - Blue Violet
            4: '#9370db', // S - Medium Purple
            5: '#ba55d3', // Z - Medium Orchid
            6: '#da70d6', // J - Orchid
            7: '#dda0dd', // L - Plum
        },
        unlockCondition: { type: 'level', value: 8, description: 'Reach Level 8' }
    },
    {
        id: 8,
        name: 'Cyber Matrix',
        unlockScore: 0,
        description: 'Digital matrix green theme',
        colors: {
            1: '#00ff41', // I - Matrix Green
            2: '#39ff14', // O - Neon Green
            3: '#00ff00', // T - Lime
            4: '#7fff00', // S - Chartreuse
            5: '#adff2f', // Z - Green Yellow
            6: '#9aff9a', // J - Light Green
            7: '#98fb98', // L - Pale Green
        },
        unlockCondition: { type: 'combo', value: 4, description: 'Get a 4x Combo' }
    },
    {
        id: 9,
        name: 'Volcanic Fire',
        unlockScore: 0,
        description: 'Hot lava and molten rock colors',
        colors: {
            1: '#8b0000', // I - Dark Red
            2: '#b22222', // O - Fire Brick
            3: '#dc143c', // T - Crimson
            4: '#ff0000', // S - Red
            5: '#ff4500', // Z - Orange Red
            6: '#ff6347', // J - Tomato
            7: '#ff8c00', // L - Dark Orange
        },
        unlockCondition: { type: 'level', value: 10, description: 'Reach Level 10' }
    },
    {
        id: 10,
        name: 'Arctic Ice',
        unlockScore: 0,
        description: 'Cool arctic and frozen tones',
        colors: {
            1: '#e0ffff', // I - Light Cyan
            2: '#b0e0e6', // O - Powder Blue
            3: '#add8e6', // T - Light Blue
            4: '#87ceeb', // S - Sky Blue
            5: '#87cefa', // Z - Light Sky Blue
            6: '#00bfff', // J - Deep Sky Blue
            7: '#1e90ff', // L - Dodger Blue
        },
        unlockCondition: { type: 'lines', value: 200, description: 'Clear 200 Lines' }
    },
    {
        id: 11,
        name: 'Golden Treasure',
        unlockScore: 25000,
        description: 'Luxurious gold and bronze tones',
        colors: {
            1: '#ffd700', // I - Gold
            2: '#ffdf00', // O - Golden Yellow
            3: '#daa520', // T - Goldenrod
            4: '#b8860b', // S - Dark Goldenrod
            5: '#cd853f', // Z - Peru
            6: '#d2691e', // J - Chocolate
            7: '#a0522d', // L - Sienna
        },
        unlockCondition: { type: 'score', value: 25000 }
    },
    {
        id: 12,
        name: 'Cosmic Galaxy',
        unlockScore: 0,
        description: 'Deep space and nebula colors',
        colors: {
            1: '#191970', // I - Midnight Blue
            2: '#483d8b', // O - Dark Slate Blue
            3: '#6a5acd', // T - Slate Blue
            4: '#7b68ee', // S - Medium Slate Blue
            5: '#9370db', // Z - Medium Purple
            6: '#8a2be2', // J - Blue Violet
            7: '#9932cc', // L - Dark Orchid
        },
        unlockCondition: { type: 'level', value: 12, description: 'Reach Level 12' }
    },
    {
        id: 13,
        name: 'Cherry Blossom',
        unlockScore: 0,
        description: 'Soft pink and spring colors',
        colors: {
            1: '#ffb7c5', // I - Cherry Blossom Pink
            2: '#ffc0cb', // O - Pink
            3: '#ffb6c1', // T - Light Pink
            4: '#ff69b4', // S - Hot Pink
            5: '#ff1493', // Z - Deep Pink
            6: '#db7093', // J - Pale Violet Red
            7: '#c71585', // L - Medium Violet Red
        },
        unlockCondition: { type: 'tetris', value: 5, description: 'Clear 5 Tetrises' }
    },
    {
        id: 14,
        name: 'Midnight Shadow',
        unlockScore: 0,
        description: 'Dark and mysterious tones',
        colors: {
            1: '#2f4f4f', // I - Dark Slate Gray
            2: '#36454f', // O - Charcoal
            3: '#414a4c', // T - Outer Space
            4: '#343434', // S - Jet
            5: '#3b3b3b', // Z - Black Olive
            6: '#28282b', // J - Raisin Black
            7: '#1c1c1c', // L - Eerie Black
        },
        unlockCondition: { type: 'combo', value: 6, description: 'Get a 6x Combo' }
    },
    {
        id: 15,
        name: 'Rainbow Prism',
        unlockScore: 50000,
        description: 'Vibrant rainbow spectrum',
        colors: {
            1: '#ff0000', // I - Red
            2: '#ff7f00', // O - Orange
            3: '#ffff00', // T - Yellow
            4: '#00ff00', // S - Green
            5: '#0000ff', // Z - Blue
            6: '#4b0082', // J - Indigo
            7: '#9400d3', // L - Violet
        },
        unlockCondition: { type: 'score', value: 50000 }
    },
    {
        id: 16,
        name: 'Autumn Harvest',
        unlockScore: 0,
        description: 'Warm autumn and harvest colors',
        colors: {
            1: '#d2691e', // I - Chocolate
            2: '#cd853f', // O - Peru
            3: '#daa520', // T - Goldenrod
            4: '#b8860b', // S - Dark Goldenrod
            5: '#bc8f8f', // Z - Rosy Brown
            6: '#8b4513', // J - Saddle Brown
            7: '#a0522d', // L - Sienna
        },
        unlockCondition: { type: 'lines', value: 300, description: 'Clear 300 Lines' }
    },
    {
        id: 17,
        name: 'Electric Storm',
        unlockScore: 0,
        description: 'Lightning and storm colors',
        colors: {
            1: '#00ffff', // I - Cyan
            2: '#00e5ff', // O - Bright Cyan
            3: '#00d4ff', // T - Electric Blue
            4: '#0099ff', // S - Azure
            5: '#0066ff', // Z - Blue
            6: '#6600ff', // J - Purple
            7: '#9900ff', // L - Violet
        },
        unlockCondition: { type: 'tetris', value: 10, description: 'Clear 10 Tetrises' }
    },
    {
        id: 18,
        name: 'Candy Land',
        unlockScore: 0,
        description: 'Sweet candy colors',
        colors: {
            1: '#ff69b4', // I - Hot Pink
            2: '#ffb6c1', // O - Light Pink
            3: '#ffc0cb', // T - Pink
            4: '#ff1493', // S - Deep Pink
            5: '#ff00ff', // Z - Magenta
            6: '#da70d6', // J - Orchid
            7: '#ee82ee', // L - Violet
        },
        unlockCondition: { type: 'level', value: 15, description: 'Reach Level 15' }
    },
    {
        id: 19,
        name: 'Legendary Master',
        unlockScore: 100000,
        description: 'Ultimate skin for true masters',
        colors: {
            1: '#ffd700', // I - Gold
            2: '#ffdf00', // O - Golden
            3: '#ffea00', // T - Bright Gold
            4: '#fff700', // S - Electric Yellow
            5: '#ffff00', // Z - Yellow
            6: '#f0e68c', // J - Khaki
            7: '#eee8aa', // L - Pale Goldenrod
        },
        unlockCondition: { type: 'score', value: 100000 }
    }
];

/**
 * Get skin by ID
 */
export function getSkinById(id) {
    return SKINS.find(skin => skin.id === id) || SKINS[0];
}

/**
 * Check if a skin is unlocked based on game stats
 * @param {Object} skin - The skin to check
 * @param {Object} stats - Game statistics { score, level, linesCleared, tetrisCount, maxCombo }
 * @returns {boolean}
 */
export function checkSkinUnlocked(skin, stats) {
    const { score = 0, level = 1, linesCleared = 0, tetrisCount = 0, maxCombo = 0 } = stats;
    
    if (!skin.unlockCondition) {
        // Fallback to old unlockScore system
        return score >= (skin.unlockScore || 0);
    }
    
    switch (skin.unlockCondition.type) {
        case 'default':
            return true;
        case 'score':
            return score >= skin.unlockCondition.value;
        case 'level':
            return level >= skin.unlockCondition.value;
        case 'lines':
            return linesCleared >= skin.unlockCondition.value;
        case 'tetris':
            return tetrisCount >= skin.unlockCondition.value;
        case 'combo':
            return maxCombo >= skin.unlockCondition.value;
        default:
            return false;
    }
}

/**
 * Get all unlocked skins for given game stats
 */
export function getUnlockedSkins(stats) {
    return SKINS.filter(skin => checkSkinUnlocked(skin, stats));
}

/**
 * Check if a specific skin is unlocked
 */
export function isSkinUnlocked(skinId, stats) {
    const skin = getSkinById(skinId);
    return skin && checkSkinUnlocked(skin, stats);
}

/**
 * Get the next skin to unlock based on current stats
 */
export function getNextSkinToUnlock(stats) {
    const lockedSkins = SKINS.filter(skin => !checkSkinUnlocked(skin, stats));
    
    // Sort by unlock difficulty (rough estimate)
    lockedSkins.sort((a, b) => {
        const aValue = a.unlockCondition?.value || a.unlockScore || 0;
        const bValue = b.unlockCondition?.value || b.unlockScore || 0;
        return aValue - bValue;
    });
    
    return lockedSkins.length > 0 ? lockedSkins[0] : null;
}

/**
 * Get unlock progress for a skin (0-1)
 */
export function getSkinUnlockProgress(skin, stats) {
    const { score = 0, level = 1, linesCleared = 0, tetrisCount = 0, maxCombo = 0 } = stats;
    
    if (!skin.unlockCondition) {
        return Math.min(score / (skin.unlockScore || 1), 1);
    }
    
    let current = 0;
    let target = skin.unlockCondition.value || 1;
    
    switch (skin.unlockCondition.type) {
        case 'default':
            return 1;
        case 'score':
            current = score;
            break;
        case 'level':
            current = level;
            break;
        case 'lines':
            current = linesCleared;
            break;
        case 'tetris':
            current = tetrisCount;
            break;
        case 'combo':
            current = maxCombo;
            break;
        default:
            return 0;
    }
    
    return Math.min(current / target, 1);
}
