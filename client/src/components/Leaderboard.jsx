import './Leaderboard.css';

const Leaderboard = ({ scores, currentPlayerAddress, isLoading, onRefresh, usernameMap = {}, t }) => {
    const formatAddress = (address) => {
        if (!address || address.length < 10) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const getDisplayName = (entry) => {
        // First check if the entry itself has a username
        if (entry.username) {
            return entry.username;
        }
        // Then check the usernameMap
        if (usernameMap[entry.player]) {
            return usernameMap[entry.player];
        }
        // Otherwise, show formatted address
        return formatAddress(entry.player);
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return t('unknownTime');
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return t('justNow');
        if (diffMins < 60) return t('minutesAgo', { count: diffMins });
        if (diffHours < 24) return t('hoursAgo', { count: diffHours });
        if (diffDays < 7) return t('daysAgo', { count: diffDays });
        return date.toLocaleDateString();
    };

    return (
        <div className="leaderboard">
            <h3>{t('leaderboard')}</h3>
            <button onClick={onRefresh} className="btn btn-secondary" disabled={isLoading}>
                {isLoading ? t('loading') : t('refresh')}
            </button>
            <div className="leaderboard-list">
                {isLoading ? (
                    <p className="empty-state">{t('loadingLeaderboard')}</p>
                ) : scores.length > 0 ? (
                    scores.map((entry, index) => (
                        <div 
                            key={index} 
                            className={`leaderboard-entry ${currentPlayerAddress === entry.player ? 'highlight' : ''}`}
                        >
                            <span className="leaderboard-rank">#{index + 1}</span>
                            <span className="leaderboard-player">{getDisplayName(entry)}</span>
                            <span className="leaderboard-score">{entry.score.toLocaleString()}</span>
                            <span className="leaderboard-timestamp">{formatTimestamp(entry.timestamp)}</span>
                        </div>
                    ))
                ) : (
                    <p className="empty-state">{t('noScoresYet')}</p>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
