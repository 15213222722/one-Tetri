import { useState, useCallback } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG, TX_CONFIG } from '../config.js';

/**
 * Hook for managing skin NFT operations (claim, transfer, marketplace)
 */
export function useSkinNFT() {
    const account = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Claim a skin as NFT
     */
    const claimSkinNFT = useCallback(async (skinId) => {
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

            // Call the mint_skin function
            tx.moveCall({
                target: `${CONTRACT_CONFIG.packageId}::${CONTRACT_CONFIG.moduleName}::mint_skin`,
                arguments: [
                    tx.pure.u64(skinId),
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
                    tx.object(CONTRACT_CONFIG.marketplaceId),
                    tx.object(nftId),
                    tx.pure.u64(price),
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

        return new Promise((resolve, reject) => {
            const tx = new Transaction();
            tx.setSender(account.address);

            // Note: This will need to be updated to use actual TETRI token coins
            // For now, using a placeholder - the smart contract will need to accept TETRI tokens
            // TODO: Query user's TETRI token coins and use them for payment
            // const tetriCoins = await client.getCoins({ owner: account.address, coinType: CONTRACT_CONFIG.token.type });
            // const [paymentCoin] = tx.splitCoins(tx.object(tetriCoins.data[0].coinObjectId), [price]);
            
            // Placeholder: Using gas coin until TETRI token payment is fully implemented
            const [coin] = tx.splitCoins(tx.gas, [price]);

            tx.moveCall({
                target: `${CONTRACT_CONFIG.packageId}::${CONTRACT_CONFIG.moduleName}::buy_skin`,
                arguments: [
                    tx.object(CONTRACT_CONFIG.marketplaceId),
                    tx.object(listingId),
                    coin,
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
    }, [account, signAndExecuteTransaction]);

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
                    tx.object(CONTRACT_CONFIG.marketplaceId),
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
        isSkinClaimed,
        isLoading,
        error,
    };
}
