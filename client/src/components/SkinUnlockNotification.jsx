import { useEffect, useState } from 'react';
import { useSkinNFT } from '../hooks/useSkinNFT.js';
import './SkinUnlockNotification.css';

/**
 * Notification component that appears when a new skin is unlocked
 */
export default function SkinUnlockNotification({ skin, onClose }) {
    const { claimSkinNFT, isSkinClaimed, isLoading, error } = useSkinNFT();
    const [claimed, setClaimed] = useState(false);

    useEffect(() => {
        if (skin) {
            setClaimed(isSkinClaimed(skin.id));
        }
    }, [skin, isSkinClaimed]);
    useEffect(() => {
        if (skin && claimed) {
            // Auto-close after 5 seconds if already claimed
            const timer = setTimeout(() => {
                onClose();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [skin, claimed, onClose]);

    const handleClaimNFT = async () => {
        try {
            await claimSkinNFT(skin.id);
            setClaimed(true);
            // Auto-close after successful claim
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Failed to claim NFT:', err);
        }
    };

    if (!skin) return null;

    // Non-intrusive toast notification instead of modal
    return (
        <div className="skin-unlock-toast" onClick={onClose}>
            <div className="skin-unlock-toast-content">
                <div className="skin-unlock-toast-icon">🎉</div>
                <div className="skin-unlock-toast-text">
                    <strong>{skin.name} Unlocked!</strong>
                    <span>Visit Customization to claim as NFT</span>
                </div>
                <div className="skin-unlock-toast-colors">
                    {Object.values(skin.colors).slice(0, 4).map((color, i) => (
                        <div
                            key={i}
                            className="skin-color-mini"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
