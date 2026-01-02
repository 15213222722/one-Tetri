import { useState, useEffect } from 'react';
import { useSuiClient } from '@onelabs/dapp-kit';
import { useSkinNFT } from '../hooks/useSkinNFT.js';
import { getSkinById } from '../skinConfig.js';
import { CONTRACT_CONFIG } from '../config.js';
import './MarketplaceView.css';

/**
 * Marketplace for trading skin NFTs
 */
export default function MarketplaceView({ onBack, t }) {
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

            const listingIds = [];
            txs.data.forEach(tx => {
                const created = tx.objectChanges?.filter(
                    change => change.type === 'created' && 
                    change.objectType.includes('::Listing')
                );
                created?.forEach(obj => listingIds.push(obj.objectId));
            });

            console.log('Found listing IDs:', listingIds);

            const listingObjects = await Promise.all(
                listingIds.map(id => suiClient.getObject({
                    id,
                    options: { showContent: true }
                }))
            );

            console.log('Listing objects:', listingObjects);

            const parsedListings = listingObjects
                .filter(obj => obj.data)
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
            setError(t('failedToLoadMarketplace'));
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNFT = async (listing) => {
        try {
            await skinNFT.buySkinNFT(listing.id, listing.price);
            await loadMarketplaceListings();
        } catch (error) {
            console.error('Failed to buy NFT:', error);
            setError(error.message || t('failedToBuyNFT'));
        }
    };

    const handleListNFT = async () => {
        if (!selectedNFT || !listPrice) return;

        try {
            const ownedNFTs = await skinNFT.getOwnedNFTs();
            console.log('Owned NFTs:', ownedNFTs);
            
            const nftToList = ownedNFTs.find(nft => nft.skinName === selectedNFT.name);
            
            if (!nftToList) {
                setError(t('couldNotFindNFT', { skinName: selectedNFT.name }));
                return;
            }
            
            const priceInTetri = parseInt(listPrice);
            await skinNFT.listSkinNFT(nftToList.objectId, priceInTetri);
            
            setShowListModal(false);
            setSelectedNFT(null);
            setListPrice('');
            setError(null);
            
            await loadMarketplaceListings();
        } catch (error) {
            console.error('Failed to list NFT:', error);
            setError(error.message || t('failedToListNFT'));
        }
    };

    const formatPrice = (priceInTetri) => {
        return priceInTetri.toLocaleString();
    };

    if (loading) {
        return (
            <div className="marketplace-view">
                <div className="marketplace-header">
                    <button className="back-button" onClick={onBack}>
                        {t('backToMenu')}
                    </button>
                    <h1>{t('marketplace')}</h1>
                </div>
                <div className="loading-message">{t('loadingMarketplace')}</div>
            </div>
        );
    }

    return (
        <div className="marketplace-view">
            <div className="grid-overlay marketplace-grid">
                <div className="grid-lines-horizontal"></div>
                <div className="grid-lines-vertical"></div>
                <div className="light-pulse pulse-1"></div>
                <div className="light-pulse pulse-3"></div>
                <div className="light-pulse pulse-4"></div>
            </div>
            <div className="floating-blocks">
                <div className="tetris-block block-j"></div>
                <div className="tetris-block block-l"></div>
                <div className="tetris-block block-t"></div>
                <div className="tetris-block block-i"></div>
            </div>
            
            <div className="marketplace-header">
                <button className="back-button" onClick={onBack}>
                    {t('backToMenu')}
                </button>
                <h1>{t('marketplace')}</h1>
            </div>

            <button 
                className="list-nft-button floating-button"
                onClick={() => setShowListModal(true)}
            >
                + {t('listNFT')}
            </button>

            <div className="marketplace-content">
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                {listings.length === 0 ? (
                    <div className="no-listings">
                        <h2>{t('noItemsForSale')}</h2>
                        <p>{t('beFirstToList')}</p>
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
                                        <h3 className="skin-name">{t(listing.skinName)}</h3>
                                        <p className="skin-description">{t('rarity', { rarity: listing.skinRarity })}</p>
                                        
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
                                            {skinNFT.isLoading ? t('buying') : t('buyNow')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showListModal && (
                <div className="modal-overlay" onClick={() => setShowListModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{t('listNFTForSale')}</h2>
                        
                        {!selectedNFT ? (
                            <>
                                <p>{t('selectNFTToSell')}</p>
                                <div className="nft-selection-grid">
                                    {skinNFT.getClaimedSkins().length === 0 ? (
                                        <p className="no-nfts">{t('noClaimedNFTs')}</p>
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
                                                    <h4>{t(skin.name)}</h4>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <button 
                                    className="cancel-button"
                                    onClick={() => setShowListModal(false)}
                                >
                                    {t('cancel')}
                                </button>
                            </>
                        ) : (
                            <>
                                <p>{t('listingNFTLabel')} <strong>{t(selectedNFT.name)}</strong></p>
                                <p>{t('enterPriceInTetri')}</p>
                                
                                <input
                                    type="number"
                                    step="1"
                                    min="1"
                                    placeholder={t('priceInTetriPlaceholder')}
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
                                        {t('back')}
                                    </button>
                                    <button 
                                        className="confirm-button"
                                        onClick={handleListNFT}
                                        disabled={!listPrice || skinNFT.isLoading}
                                    >
                                        {skinNFT.isLoading ? t('listing') : t('listNFT')}
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
