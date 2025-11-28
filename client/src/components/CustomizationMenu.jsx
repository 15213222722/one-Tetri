import { useState } from 'react';
import { SKINS, getSkinById } from '../skinConfig.js';
import { useSkinUnlocks } from '../hooks/useSkinUnlocks.js';
import { useSkinNFT } from '../hooks/useSkinNFT.js';
import './CustomizationMenu.css';

/**
 * Customization menu for selecting and claiming skin NFTs
 */
export default function CustomizationMenu({ onBack, onSkinSelect }) {
    const skinUnlocks = useSkinUnlocks();
    const skinNFT = useSkinNFT();
    
    const [selectedSkin, setSelectedSkin] = useState(() => {
        const saved = localStorage.getItem('selectedSkin');
        return saved ? parseInt(saved) : 0; // Default to Classic skin
    });

    const handleSkinSelect = (skinId) => {
        setSelectedSkin(skinId);
        localStorage.setItem('selectedSkin', skinId.toString());
        if (onSkinSelect) {
            onSkinSelect(getSkinById(skinId));
        }
    };

    const handleClaimNFT = async (skinId) => {
        try {
            const skin = getSkinById(skinId);
            await skinNFT.claimSkinNFT(skinId, skin.name, skin.colors);
            // Success feedback will be handled by the hook
        } catch (error) {
            console.error('Failed to claim NFT:', error);
        }
    };

    return (
        <div className="customization-menu">
            {/* Animated Background for Customization */}
            <div className="grid-overlay customization-grid">
                <div className="grid-lines-horizontal"></div>
                <div className="grid-lines-vertical"></div>
                <div className="light-pulse pulse-1"></div>
                <div className="light-pulse pulse-2"></div>
                <div className="light-pulse pulse-3"></div>
            </div>
            <div className="floating-blocks">
                <div className="tetris-block block-i"></div>
                <div className="tetris-block block-o"></div>
                <div className="tetris-block block-t"></div>
                <div className="tetris-block block-s"></div>
                <div className="tetris-block block-z"></div>
            </div>
            
            <div className="customization-header">
                <button className="back-button" onClick={onBack}>
                    ← BACK
                </button>
                <h1>CUSTOMIZATION</h1>
            </div>

            <div className="customization-content">
                <div className="skins-grid">
                    {SKINS.map((skin) => {
                        const isUnlocked = skinUnlocks.isSkinUnlocked(skin.id);
                        const isClaimed = skinNFT.isSkinClaimed(skin.id);
                        const isSelected = selectedSkin === skin.id;

                        return (
                            <div
                                key={skin.id}
                                className={`skin-card ${
                                    isUnlocked ? 'unlocked' : 'locked'
                                } ${
                                    isSelected ? 'selected' : ''
                                }`}
                                onClick={() => isUnlocked && handleSkinSelect(skin.id)}
                            >
                                <div className="skin-preview">
                                    <div className="skin-colors">
                                        {Object.values(skin.colors).map((color, i) => (
                                            <div
                                                key={i}
                                                className="skin-color-block"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="skin-info">
                                    <h3 className="skin-name">{skin.name}</h3>
                                    <p className="skin-description">{skin.description}</p>
                                    
                                    {!isUnlocked && (
                                        <div className="skin-requirement">
                                            🔒 Reach {skin.unlockScore.toLocaleString()} points
                                        </div>
                                    )}

                                    {isUnlocked && !isClaimed && (
                                        <button
                                            className="claim-nft-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClaimNFT(skin.id);
                                            }}
                                            disabled={skinNFT.isLoading}
                                        >
                                            {skinNFT.isLoading ? 'CLAIMING...' : 'CLAIM AS NFT'}
                                        </button>
                                    )}

                                    {isClaimed && (
                                        <div className="nft-claimed">
                                            ✅ NFT CLAIMED
                                        </div>
                                    )}

                                    {isSelected && (
                                        <div className="skin-selected">
                                            ⭐ ACTIVE
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {skinNFT.error && (
                    <div className="error-message">
                        ❌ {skinNFT.error}
                    </div>
                )}
            </div>
        </div>
    );
}
