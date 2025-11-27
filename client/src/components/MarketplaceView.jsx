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

            // Query all Listing objects
            // Listings are shared objects, so we need to query them differently
            // For now, we'll query objects owned by all addresses (this is a workaround)
            // In production, you'd want to index listings or use a subgraph
            
            // Try querying recent transactions to find created Listing objects
            const txs = await suiClient.queryTransactionBlocks({
                filter: {
                    MoveFunction: {
                        package: CONTRACT_CONFIG.packageId,
                        module: CONTRACT_CONFIG.moduleName,
                        function: 'list_skin'
                    }
                },
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                },
                limit: 50,
            });

            console.log('List skin transactions:', txs);

            // Extract created Listing objects from transactions
            const listingIds = [];
            txs.data.forEach(tx => {
                const created = tx.objectChanges?.filter(
                    change => change.type === 'created' && 
                    change.objectType.includes('::Listing')
                );
                created?.forEach(obj => listingIds.push(obj.objectId));
            });

            console.log('Found listing IDs:', listingIds);

            // Fetch each listing object
            const listingObjects = await Promise.all(
                listingIds.map(id => suiClient.getObject({
                    id,
                    options: { showContent: true }
                }))
            );

            console.log('Listing objects:', listingObjects);

            // Parse listings
            const parsedListings = listingObjects
                .filter(obj => obj.data) // Filter out any failed fetches
                .map(obj => {
                    const fields = obj.data?.content?.fields;
                    const skinFields = fields?.skin?.fields;
                    
                    return {
                        id: obj.data.objectId,
                        seller: fields?.seller || 'Unknown',
                        price: parseInt(fields?.price || 0),
                        expiresAt: parseInt(fields?.expires_at || 0),
                        skinName: skinFields?.name || 'Unknown',
                        skinColors: skinFields?.colors || [],
                        skinRarity: skinFields?.rarity || 0,
                    };
                });

            console.log('Parsed listings:', parsedListings);
            setListings(parsedListings);
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
            // Query user's owned NFTs to get the actual object ID
            const ownedNFTs = await skinNFT.getOwnedNFTs();
            console.log('Owned NFTs:', ownedNFTs);
            
            // Find the NFT that matches the selected skin name
            const nftToList = ownedNFTs.find(nft => nft.skinName === selectedNFT.name);
            
            if (!nftToList) {
                setError(`Could not find NFT for ${selectedNFT.name} in your wallet. Make sure you claimed it as an NFT.`);
                return;
            }
            
            const priceInTetri = parseInt(listPrice);
            await skinNFT.listSkinNFT(nftToList.objectId, priceInTetri);
            
            setShowListModal(false);
            setSelectedNFT(null);
            setListPrice('');
            setError(null);
            
            // Refresh listings
            await loadMarketplaceListings();
        } catch (error) {
            console.error('Failed to list NFT:', error);
            setError(error.message || 'Failed to list NFT');
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
                            return (
                                <div key={listing.id} className="listing-card">
                                    <div className="listing-preview">
                                        <div className="skin-colors">
                                            {listing.skinColors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="skin-color-block"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="listing-info">
                                        <h3 className="skin-name">{listing.skinName}</h3>
                                        <p className="skin-description">Rarity: {listing.skinRarity}</p>
                                        
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
                        
                        {!selectedNFT ? (
                            <>
                                <p>Select which NFT you want to sell:</p>
                                <div className="nft-selection-grid">
                                    {skinNFT.getClaimedSkins().length === 0 ? (
                                        <p className="no-nfts">You don't have any claimed NFTs yet. Claim skins in the Customization menu first!</p>
                                    ) : (
                                        skinNFT.getClaimedSkins().map(skinId => {
                                            const skin = getSkinById(skinId);
                                            return (
                                                <div 
                                                    key={skinId}
                                                    className="nft-selection-card"
                                                    onClick={() => setSelectedNFT({ id: skinId, ...skin })}
                                                >
                                                    <div className="skin-colors-small">
                                                        {Object.values(skin.colors).map((color, i) => (
                                                            <div
                                                                key={i}
                                                                className="skin-color-block-small"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <h4>{skin.name}</h4>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <button 
                                    className="cancel-button"
                                    onClick={() => setShowListModal(false)}
                                >
                                    CANCEL
                                </button>
                            </>
                        ) : (
                            <>
                                <p>Listing: <strong>{selectedNFT.name}</strong></p>
                                <p>Enter the price in TETRI tokens:</p>
                                
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
                                        onClick={() => {
                                            setSelectedNFT(null);
                                            setListPrice('');
                                        }}
                                    >
                                        BACK
                                    </button>
                                    <button 
                                        className="confirm-button"
                                        onClick={handleListNFT}
                                        disabled={!listPrice || skinNFT.isLoading}
                                    >
                                        {skinNFT.isLoading ? 'LISTING...' : 'LIST NFT'}
                                    </button>
                                </div>
                            </>
                        )}
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
