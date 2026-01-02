const WalletStatus = ({ account, balance, isLoadingBalance, onRefreshBalance, username, isLoadingUsername, t }) => {
    const formatAddress = (address) => {
        if (!address || address.length < 10) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="token-balance">
            <h3>{t('yourProfile')}</h3>
            {account ? (
                <>
                    {username && (
                        <p className="username-display">
                            <span className="username-label">{t('username')}:</span>
                            <span className="username-value">{username}</span>
                        </p>
                    )}
                    {isLoadingUsername && (
                        <p className="username-loading">{t('loadingUsername')}</p>
                    )}
                    <p className="wallet-address">{formatAddress(account.address)}</p>
                    <p className="balance-amount">
                        {isLoadingBalance ? t('loading') : `${balance.toFixed(2)} TETRI`}
                    </p>
                    <button 
                        onClick={onRefreshBalance} 
                        className="btn btn-secondary"
                        disabled={isLoadingBalance}
                    >
                        {isLoadingBalance ? t('loading') : t('refresh')}
                    </button>
                </>
            ) : (
                <p className="empty-state">{t('connectWalletToViewProfile')}</p>
            )}
        </div>
    );
};

export default WalletStatus;
