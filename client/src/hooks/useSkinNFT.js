import { useState, useCallback } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@onelabs/dapp-kit';
import { Transaction } from '@onelabs/sui/transactions';
import { bcs } from '@onelabs/sui/bcs';
import { CONTRACT_CONFIG, TX_CONFIG } from '../config.js';

/**
 * Hook for managing skin NFT operations (claim, transfer, marketplace)
 */
export function useSkinNFT() {
    const account = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Claim a skin as NFT
     */
    const claimSkinNFT = useCallback(async (skinId, skinName, skinColors) => {
        if (!account) {
            throw new Error('Wallet not connected');
        }

        if (skinId === undefined || skinId === null) {
            throw new Error('Skin ID is required');
        }

        setIsLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            const tx = new Transaction();
            tx.setSender(account.address);

            // Convert colors object to array of strings in correct order (1-7)
            const colorsArray = [
                skinColors[1], // I piece
                skinColors[2], // O piece
                skinColors[3], // T piece
                skinColors[4], // S piece
                skinColors[5], // Z piece
                skinColors[6], // J piece
                skinColors[7], // L piece
            ];

            // Call the mint_skin function
            tx.moveCall({
                target: `${CONTRACT_CONFIG.packageId}::${CONTRACT_CONFIG.moduleName}::mint_skin`,
                arguments: [
                    tx.pure(bcs.string().serialize(skinName).toBytes()),
                    tx.pure(bcs.u8().serialize(0).toBytes()),
                    tx.pure(bcs.vector(bcs.string()).serialize(colorsArray).toBytes()),
                    tx.object(CONTRACT_CONFIG.clockId),
                ],
            });

            tx.setGasBudget(TX_CONFIG.submitScoreGasBudget);

            signAndExecuteTransaction(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        console.log('✅ Skin NFT claimed successfully:', result);
                        
                        // Update claimed status in localStorage
                        const claimedSkins = JSON.parse(localStorage.getItem('claimedSkins') || '[]');
                        if (!claimedSkins.includes(skinId)) {
                            claimedSkins.push(skinId);
                            localStorage.setItem('claimedSkins', JSON.stringify(claimedSkins));
                        }
                        
                        setIsLoading(false);
                        resolve(result);
                    },
                    onError: (err) => {
                        console.error('❌ Failed to claim skin NFT:', err);
                        const errorMessage = err.message || 'Failed to claim skin NFT';
                        setError(errorMessage);
                        setIsLoading(false);
                        reject(err);
                    },
                }
            );
        });
    }, [account, signAndExecuteTransaction]);

    /**
     * List skin NFT on marketplace
     */
    const listSkinNFT = useCallback(async (nftId, price) => {
        if (!account) {
            throw new Error('Wallet not connected');
        }

        setIsLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            const tx = new Transaction();
            tx.setSender(account.address);

            tx.moveCall({
                target: `${CONTRACT_CONFIG.packageId}::${CONTRACT_CONFIG.moduleName}::list_skin`,
                arguments: [
                    tx.object(nftId),
                    tx.pure.u64(price),
                    tx.pure.u64(86400000), // 24 hours in milliseconds
                    tx.object(CONTRACT_CONFIG.clockId),
                ],
            });

            tx.setGasBudget(TX_CONFIG.submitScoreGasBudget);

            signAndExecuteTransaction(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        console.log('✅ Skin NFT listed successfully:', result);
                        setIsLoading(false);
                        resolve(result);
                    },
                    onError: (err) => {
                        console.error('❌ Failed to list skin NFT:', err);
                        const errorMessage = err.message || 'Failed to list skin NFT';
                        setError(errorMessage);
                        setIsLoading(false);
                        reject(err);
                    },
                }
            );
        });
    }, [account, signAndExecuteTransaction]);

    /**
     * Buy skin NFT from marketplace using TETRI tokens
     */
    const buySkinNFT = useCallback(async (listingId, price) => {
        if (!account) {
            throw new Error('Wallet not connected');
        }

        setIsLoading(true);
        setError(null);

        try {
            // Query user's TETRI token coins
            const tetriCoins = await suiClient.getCoins({
                owner: account.address,
                coinType: CONTRACT_CONFIG.token.type,
            });

            console.log('TETRI coins:', tetriCoins);

            if (!tetriCoins.data || tetriCoins.data.length === 0) {
                throw new Error('You don\'t have any TETRI tokens. Play games to earn tokens!');
            }

            // Calculate total balance
            const totalBalance = tetriCoins.data.reduce((sum, coin) => sum + parseInt(coin.balance), 0);
            
            if (totalBalance < price) {
                throw new Error(`Insufficient TETRI tokens. You have ${totalBalance} but need ${price}`);
            }

            return new Promise((resolve, reject) => {
                const tx = new Transaction();
                tx.setSender(account.address);

                // Use the first TETRI coin and split the payment amount
                const [paymentCoin] = tx.splitCoins(tx.object(tetriCoins.data[0].coinObjectId), [price]);

                tx.moveCall({
                    target: `${CONTRACT_CONFIG.packageId}::${CONTRACT_CONFIG.moduleName}::buy_skin`,
                    arguments: [
                        tx.object(listingId),
                        paymentCoin,
                        tx.object(CONTRACT_CONFIG.marketplaceId),
                        tx.object(CONTRACT_CONFIG.clockId),
                    ],
                });

                tx.setGasBudget(TX_CONFIG.submitScoreGasBudget);

                signAndExecuteTransaction(
                    { transaction: tx },
                    {
                        onSuccess: (result) => {
                            console.log('✅ Skin NFT purchased successfully:', result);
                            setIsLoading(false);
                            resolve(result);
                        },
                        onError: (err) => {
                            console.error('❌ Failed to buy skin NFT:', err);
                            const errorMessage = err.message || 'Failed to buy skin NFT';
                            setError(errorMessage);
                            setIsLoading(false);
                            reject(err);
                        },
                    }
                );
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
            throw error;
        }
    }, [account, signAndExecuteTransaction, suiClient]);

    /**
     * Cancel marketplace listing
     */
    const cancelListing = useCallback(async (listingId) => {
        if (!account) {
            throw new Error('Wallet not connected');
        }

        setIsLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            const tx = new Transaction();
            tx.setSender(account.address);

            tx.moveCall({
                target: `${CONTRACT_CONFIG.packageId}::${CONTRACT_CONFIG.moduleName}::cancel_listing`,
                arguments: [
                    tx.object(listingId),
                ],
            });

            tx.setGasBudget(TX_CONFIG.submitScoreGasBudget);

            signAndExecuteTransaction(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        console.log('✅ Listing cancelled successfully:', result);
                        setIsLoading(false);
                        resolve(result);
                    },
                    onError: (err) => {
                        console.error('❌ Failed to cancel listing:', err);
                        const errorMessage = err.message || 'Failed to cancel listing';
                        setError(errorMessage);
                        setIsLoading(false);
                        reject(err);
                    },
                }
            );
        });
    }, [account, signAndExecuteTransaction]);

    /**
     * Get claimed skins from localStorage
     */
    const getClaimedSkins = useCallback(() => {
        return JSON.parse(localStorage.getItem('claimedSkins') || '[]');
    }, []);

    /**
     * Query user's owned BlockSkin NFTs from blockchain
     * Returns array of { objectId, skinName, colors, rarity }
     */
    const getOwnedNFTs = useCallback(async () => {
        if (!account) {
            return [];
        }

        try {
            console.log('Querying owned NFTs for address:', account.address);
            
            // Query owned objects filtered by BlockSkin type
            const ownedObjects = await suiClient.getOwnedObjects({
                owner: account.address,
                filter: {
                    StructType: `${CONTRACT_CONFIG.packageId}::${CONTRACT_CONFIG.moduleName}::BlockSkin`
                },
                options: {
                    showContent: true,
                    showType: true,
                }
            });

            console.log('Owned NFTs:', ownedObjects);

            // Parse the NFT data
            const nfts = ownedObjects.data.map(obj => {
                const fields = obj.data?.content?.fields;
                return {
                    objectId: obj.data.objectId,
                    skinName: fields?.name || 'Unknown',
                    colors: fields?.colors || [],
                    rarity: fields?.rarity || 0,
                };
            });

            return nfts;
        } catch (error) {
            console.error('Failed to query owned NFTs:', error);
            return [];
        }
    }, [account, suiClient]);

    /**
     * Check if a skin is claimed
     */
    const isSkinClaimed = useCallback((skinId) => {
        const claimedSkins = getClaimedSkins();
        return claimedSkins.includes(skinId);
    }, [getClaimedSkins]);

    return {
        claimSkinNFT,
        listSkinNFT,
        buySkinNFT,
        cancelListing,
        getClaimedSkins,
        getOwnedNFTs,
        isSkinClaimed,
        isLoading,
        error,
    };
}
