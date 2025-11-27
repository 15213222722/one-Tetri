import { useState, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { useSkinNFT } from '../hooks/useSkinNFT.js';
import { getSkinById } from '../skinConfig.js';
import { CONTRACT_CONFIG } from '../config.js';
import './MarketplaceView.css';

/**
 * Marketplace for trading skin NFTs
 */
export default function MarketplaceView({ onBack }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showListModal, setShowListModal] = useState(false);
    const [selectedNFT, setSelectedNFT] = useState(null);
    const [listPrice, setListPrice] = useState('');
    
    const suiClient = useSuiClient();
    const skinNFT = useSkinNFT();

    // Load marketplace listings
    useEffect(() => {
        loadMarketplaceListings();
    }, []);

    const loadMarketplaceListings = async () => {
        try {
            setLoading(true);
            setError(null);

            // Query marketplace object for listings
            const marketplaceObject = await suiClient.getObject({
                id: CONTRACT_CONFIG.marketplaceId,
                options: {
                    showContent: true,
                    showType: true,
                }
            });

            // For now, we'll show mock data since querying dynamic fields is complex
            // In a real implementation, you'd query the marketplace's dynamic fields
            const mockListings = [
                {
                    id: 'listing_1',
                    skinId: 1,
                    price: 1000, // 1000 TETRI tokens (no decimals)
                    seller: '0x1234...5678',
                    nftId: 'nft_1'
                },
                {
                    id: 'listing_2', 
                    skinId: 2,
                    price: 5000, // 5000 TETRI tokens (no decimals)
                    seller: '0x8765...4321',
                    nftId: 'nft_2'
                }
            ];

            setListings(mockListings);
        } catch (err) {
            console.error('Failed to load marketplace listings:', err);
            setError('Failed to load marketplace listings');
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNFT = async (listing) => {
        try {
            await skinNFT.buySkinNFT(listing.id, listing.price);
            // Refresh listings after purchase
            await loadMarketplaceListings();
        } catch (error) {
            console.error('Failed to buy NFT:', error);
        }
    };

    const handleListNFT = async () => {
        if (!selectedNFT || !listPrice) return;

        try {
            // TETRI tokens have 0 decimals, so price is already in the correct format
            const priceInTetri = parseInt(listPrice);
            await skinNFT.listSkinNFT(selectedNFT.id, priceInTetri);
            setShowListModal(false);
            setSelectedNFT(null);
            setListPrice('');
            // Refresh listings
            await loadMarketplaceListings();
        } catch (error) {
            console.error('Failed to list NFT:', error);
        }
    };

    const formatPrice = (priceInTetri) => {
        // TETRI tokens have 0 decimals, so no conversion needed
        return priceInTetri.toLocaleString();
    };

    if (loading) {
        return (
            <div className="marketplace-view">
                <div className="marketplace-header">
                    <button className="back-button" onClick={onBack}>
                        ← BACK
                    </button>
                    <h1>MARKETPLACE</h1>
                </div>
                <div className="loading-message">Loading marketplace...</div>
            </div>
        );
    }

    return (
        <div className="marketplace-view">
            <div className="marketplace-header">
                <button className="back-button" onClick={onBack}>
                    ← BACK
                </button>
                <h1>MARKETPLACE</h1>
            </div>

            {/* Floating List NFT Button */}
            <button 
                className="list-nft-button floating-button"
                onClick={() => setShowListModal(true)}
            >
                + LIST NFT
            </button>

            <div className="marketplace-content">
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                {listings.length === 0 ? (
                    <div className="no-listings">
                        <h2>No items for sale</h2>
                        <p>Be the first to list a skin NFT!</p>
                    </div>
                ) : (
                    <div className="listings-grid">
                        {listings.map((listing) => {
                            const skin = getSkinById(listing.skinId);
                            return (
                                <div key={listing.id} className="listing-card">
                                    <div className="listing-preview">
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

                                    <div className="listing-info">
                                        <h3 className="skin-name">{skin.name}</h3>
                                        <p className="skin-description">{skin.description}</p>
                                        
                                        <div className="listing-details">
                                            <div className="price">
                                                💰 {formatPrice(listing.price)} TETRI
                                            </div>
                                            <div className="seller">
                                                👤 {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                                            </div>
                                        </div>

                                        <button
                                            className="buy-button"
                                            onClick={() => handleBuyNFT(listing)}
                                            disabled={skinNFT.isLoading}
                                        >
                                            {skinNFT.isLoading ? 'BUYING...' : 'BUY NOW'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* List NFT Modal */}
            {showListModal && (
                <div className="modal-overlay" onClick={() => setShowListModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>List NFT for Sale</h2>
                        <p>Enter the price in TETRI tokens for your NFT:</p>
                        
                        <input
                            type="number"
                            step="1"
                            min="1"
                            placeholder="Price in TETRI (e.g., 1000)"
                            value={listPrice}
                            onChange={(e) => setListPrice(e.target.value)}
                            className="price-input"
                        />

                        <div className="modal-buttons">
                            <button 
                                className="cancel-button"
                                onClick={() => setShowListModal(false)}
                            >
                                CANCEL
                            </button>
                            <button 
                                className="confirm-button"
                                onClick={handleListNFT}
                                disabled={!listPrice || skinNFT.isLoading}
                            >
                                {skinNFT.isLoading ? 'LISTING...' : 'LIST NFT'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {skinNFT.error && (
                <div className="error-toast">
                    ❌ {skinNFT.error}
                </div>
            )}
        </div>
    );
}
