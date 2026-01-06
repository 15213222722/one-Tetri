import { useState, useEffect, useMemo } from 'react';
import { ConnectButton } from '@onelabs/dapp-kit';
import GameBoard from './components/GameBoard.jsx';
import GameInfo from './components/GameInfo.jsx';
import PiecePreview from './components/PiecePreview.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import WalletStatus from './components/WalletStatus.jsx';
import LoadingOverlay from './components/LoadingOverlay.jsx';
import Toast from './components/Toast.jsx';
import UsernameRegistrationModal from './components/UsernameRegistrationModal.jsx';
import MultiplayerMenu from './components/MultiplayerMenu.jsx';
import BattleView from './components/BattleView.jsx';
import SkinUnlockNotification from './components/SkinUnlockNotification.jsx';
import CustomizationMenu from './components/CustomizationMenu.jsx';
import MarketplaceView from './components/MarketplaceView.jsx';
import { useGame } from './hooks/useGame.js';
import { useBlockchain } from './hooks/useBlockchain.js';
import { useWebSocket } from './hooks/useWebSocket.js';
import { useBattleFlow } from './hooks/useBattleFlow.js';
import { useMultiplayerBattle } from './hooks/useMultiplayerBattle.js';
import { useSkinUnlocks } from './hooks/useSkinUnlocks.js';
import { useSound } from './hooks/useSound.js';
import { getSkinById } from './skinConfig.js';
import en from './locales/en.json';
import zh from './locales/zh.json';
import "./App.css";

// Authentication states
const AUTH_STATES = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    VERIFYING: 'verifying',
    REGISTERING: 'registering',
    AUTHENTICATED: 'authenticated'
};

function App() {
    const [gameSeedObjectId, setGameSeedObjectId] = useState(null);
    const [gameSeed, setGameSeed] = useState(null);
    const [currentScreen, setCurrentScreen] = useState('landing'); // landing, menu, solo, multiplayer, config, marketplace, customization
    const [gameMode, setGameMode] = useState('menu'); // menu, playing, gameOver
    const [loadingMessage, setLoadingMessage] = useState('');
    const [authState, setAuthState] = useState(AUTH_STATES.DISCONNECTED);
    const [authMessage, setAuthMessage] = useState('');
    const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
    const [showTutorial, setShowTutorial] = useState(false);
    const [selectedSkin, setSelectedSkin] = useState(() => {
        return parseInt(localStorage.getItem('selectedSkin') || '0');
    });
    const [isClaimingSkin, setIsClaimingSkin] = useState(false);
    const [language, setLanguage] = useState('zh');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'zh' : 'en');
    };

    const t = useMemo(() => {
        const texts = {
            en,
            zh
        };
        return (key, options) => {
            let text = texts[language][key] || key;
            if (options && typeof options === 'object') {
                Object.keys(options).forEach(optionKey => {
                    const regex = new RegExp(`{{${optionKey}}}`, 'g');
                    text = text.replace(regex, options[optionKey]);
                });
            }
            return text;
        };
    }, [language]);

    const game = useGame(gameSeed);
    const blockchain = useBlockchain();
    const sound = useSound();

    // Memoize game stats for skin unlock system
    const gameStats = useMemo(() => ({
        score: game.gameState.score,
        level: game.gameState.level,
        linesCleared: game.gameState.linesCleared,
        tetrisCount: game.gameState.tetrisCount,
        maxCombo: game.gameState.maxCombo
    }), [
        game.gameState.score,
        game.gameState.level,
        game.gameState.linesCleared,
        game.gameState.tetrisCount,
        game.gameState.maxCombo
    ]);

    // Skin unlock system
    const skinUnlocks = useSkinUnlocks(gameStats);

    // Multiplayer hooks
    const webSocket = useWebSocket(blockchain.account?.address, blockchain.username);
    const battleFlow = useBattleFlow(webSocket.socket, blockchain.account?.address, blockchain.username);
    const multiplayerBattle = useMultiplayerBattle(
        webSocket.socket,
        battleFlow.roomData,
        battleFlow.opponentData
    );

    // Handle wallet connection state transitions
    useEffect(() => {
        if (!blockchain.account) {
            // No wallet connected
            if (authState !== AUTH_STATES.DISCONNECTED) {
                setAuthState(AUTH_STATES.DISCONNECTED);
                setAuthMessage('');
                setCurrentScreen('landing');
            }
        } else {
            // Wallet is connected
            if (authState === AUTH_STATES.DISCONNECTED) {
                // Just connected, start verification
                setAuthState(AUTH_STATES.VERIFYING);
                setAuthMessage(t('checkingUsername'));
            }
        }
    }, [blockchain.account, authState, t]);

    // Handle username verification completion
    useEffect(() => {
        if (authState === AUTH_STATES.VERIFYING && !blockchain.isLoadingUsername) {
            if (blockchain.username) {
                // Username exists, authenticate
                setAuthState(AUTH_STATES.AUTHENTICATED);
                setAuthMessage('');
            } else {
                // No username, show registration
                setAuthState(AUTH_STATES.REGISTERING);
                setAuthMessage('');
            }
        }
    }, [authState, blockchain.isLoadingUsername, blockchain.username]);

    // Handle authentication completion
    useEffect(() => {
        if (authState === AUTH_STATES.AUTHENTICATED && currentScreen === 'landing') {
            showToast('success', t('authSuccess'));
            setCurrentScreen('menu');
        }
    }, [authState, currentScreen, t]);

    // Load leaderboard when entering menu screen
    useEffect(() => {
        if (currentScreen === 'menu' && blockchain.account) {
            blockchain.fetchLeaderboard().catch(err => {
                console.error('Failed to load leaderboard:', err);
            });
        }
    }, [currentScreen, blockchain.account]);

    // Handle successful username registration
    const handleUsernameRegistered = () => {
        setAuthState(AUTH_STATES.AUTHENTICATED);
        showToast('success', t('usernameRegisteredSuccess'));
    };

    // Show toast notification
    const showToast = (type, message) => {
        setToast({ show: true, type, message });
    };

    // Handle start game
    const handleStartGame = async () => {
        // Must have wallet connected
        if (!blockchain.account) {
            showToast('error', t('connectWalletFirst'));
            return;
        }

        try {
            setLoadingMessage(t('creatingGameSeedOnBlockchain'));
            const result = await blockchain.createGameSeed();
            setGameSeedObjectId(result.gameSeedObjectId);
            setGameSeed(result.seed);
            showToast('success', t('gameSeedCreated'));

            game.startGame();
            setGameMode('playing');
        } catch (error) {
            console.error('Failed to start game:', error);
            showToast('error', error.message || t('failedToCreateGameSeed'));
        }
    };

    // Handle game over
    useEffect(() => {
        if (game.gameState.isGameOver && gameMode === 'playing') {
            setGameMode('gameOver');
        }
    }, [game.gameState.isGameOver, gameMode]);

    // Handle submit score
    const handleSubmitScore = async () => {
        if (!gameSeedObjectId || !blockchain.account) {
            showToast('error', t('noBlockchainGameSeed'));
            return;
        }
        console.log('Game seed:', gameSeedObjectId);
        console.log('Score:', game.gameState.score);
        try {
            setLoadingMessage(t('submittingScoreToBlockchain'));
            const result = await blockchain.submitScore(gameSeedObjectId, game.gameState.score);
            showToast('success', t('scoreSubmitted', { tokens: result.tokensEarned }));

            // Wait a bit for blockchain to process, then refresh data
            setLoadingMessage(t('updatingLeaderboardAndBalance'));
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

            await blockchain.fetchLeaderboard();
            await blockchain.fetchPlayerBalance();

            setLoadingMessage('');
        } catch (error) {
            console.error('Failed to submit score:', error);
            showToast('error', error.message || t('failedToSubmitScore'));
            setLoadingMessage('');
        }
    };

    // Handle play again
    const handlePlayAgain = () => {
        setGameMode('menu');
        setGameSeedObjectId(null);
        setGameSeed(null);
    };

    // Handle skin selection
    const handleSelectSkin = (skin) => {
        setSelectedSkin(skin.id);
        localStorage.setItem('selectedSkin', skin.id.toString());
        showToast('success', t('skinSelected'));
    };

    // Handle claim skin as NFT
    const handleClaimSkin = async (skin) => {
        if (!blockchain.account) {
            showToast('error', t('connectWalletFirst'));
            return;
        }

        setIsClaimingSkin(true);
        try {
            const result = await blockchain.claimSkinNFT(skin.id, skin.name, skin.colors);
            showToast('success', t('skinClaimed', { skinName: skin.name }));
            return result;
        } catch (error) {
            console.error('Failed to claim skin:', error);
            showToast('error', error.message || t('failedToClaimSkin'));
            throw error;
        } finally {
            setIsClaimingSkin(false);
        }
    };

    return (
        <div className="app">
            <div className="top-right-container">
                {/* Language Toggle Button */}
                {currentScreen !== 'landing' && (
                    <button onClick={toggleLanguage} className="language-toggle-button">
                        {language === 'en' ? '中文' : 'English'}
                    </button>
                )}

                {/* Mute Button */}
                {currentScreen !== 'landing' && (
                    <button 
                        className="mute-toggle-button"
                        onClick={sound.toggleMute}
                    >
                        {sound.isMuted ? t('soundOff') : t('soundOn')}
                    </button>
                )}

                {/* Wallet Info in Corner */}
                {blockchain.account && currentScreen !== 'landing' && (
                    <div className="wallet-info-corner">
                        <span className="wallet-label">{t('uid')}</span>
                        <span className="wallet-address-short">
                            {blockchain.account.address.slice(0, 6)}...{blockchain.account.address.slice(-4)}
                        </span>
                    </div>
                )}
            </div>

            {/* Tutorial Modal */}
            {showTutorial && (
                <div className="tutorial-overlay" onClick={() => setShowTutorial(false)}>
                    <div className="tutorial-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="tutorial-close" onClick={() => setShowTutorial(false)}>×</button>
                        <h2>{t('howToPlay')}</h2>
                        <div className="tutorial-content">
                            <h3>{t('controls')}</h3>
                            <p><kbd>←</kbd> <kbd>→</kbd> {t('movePiece')}</p>
                            <p><kbd>↑</kbd> {t('rotatePiece')}</p>
                            <p><kbd>↓</kbd> {t('softDrop')}</p>
                            <p><kbd>SPACE</kbd> {t('hardDrop')}</p>
                            <p><kbd>P</kbd> {t('pauseResume')}</p>

                            <h3>{t('gameplay')}</h3>
                            <p>• {t('clearLines')}</p>
                            <p>• {t('scoreIncreases')}</p>
                            <p>• {t('levelUp')}</p>
                            <p>• {t('gameOverCondition')}</p>

                            <h3>{t('blockchain')}</h3>
                            <p>• {t('connectWallet')}</p>
                            <p>• {t('fairSeed')}</p>
                            <p>• {t('submitScores')}</p>
                            <p>• {t('competeLeaderboard')}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Landing Screen */}
            {currentScreen === 'landing' && (
                <div className="landing-screen">
                    {/* Animated Grid with Light Pulses */}
                    <div className="grid-overlay">
                        <div className="grid-lines-horizontal"></div>
                        <div className="grid-lines-vertical"></div>
                        <div className="light-pulse pulse-1"></div>
                        <div className="light-pulse pulse-2"></div>
                        <div className="light-pulse pulse-3"></div>
                        <div className="light-pulse pulse-4"></div>
                    </div>

                    {/* Floating Tetris Blocks Background */}
                    <div className="floating-blocks">
                        <div className="tetris-block block-i"></div>
                        <div className="tetris-block block-o"></div>
                        <div className="tetris-block block-t"></div>
                        <div className="tetris-block block-s"></div>
                        <div className="tetris-block block-z"></div>
                        <div className="tetris-block block-j"></div>
                        <div className="tetris-block block-l"></div>
                    </div>

                    <h1 className="game-title" data-text="TETRICHAIN">{t('gameTitle')}</h1>
                    <p className="game-subtitle">{t('gameSubtitle')}</p>

                    <div className="landing-buttons">
                        <ConnectButton />
                        <button
                            className="btn btn-secondary tutorial-btn"
                            onClick={() => setShowTutorial(true)}
                        >
                            {t('howToPlay')}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Menu Screen */}
            {currentScreen === 'menu' && (
                <div className="main-menu">
                    {/* Animated Background for Menu */}
                    <div className="grid-overlay menu-grid">
                        <div className="grid-lines-horizontal"></div>
                        <div className="grid-lines-vertical"></div>
                        <div className="light-pulse pulse-1"></div>
                        <div className="light-pulse pulse-3"></div>
                    </div>
                    <div className="floating-blocks">
                        <div className="tetris-block block-i"></div>
                        <div className="tetris-block block-t"></div>
                        <div className="tetris-block block-z"></div>
                        <div className="tetris-block block-l"></div>
                    </div>

                    <h1 className="menu-title">TETRICHAIN</h1>

                    <div className="menu-options">
                        <button
                            className="menu-button solo-button"
                            onMouseEnter={() => sound.playHoverSound()}
                            onClick={() => {
                                sound.playClickSound();
                                setCurrentScreen('solo');
                            }}
                        >
                            <div className="menu-button-icon">1P</div>
                            <div className="menu-button-content">
                                <div className="menu-button-title">{t('solo')}</div>
                                <div className="menu-button-subtitle">{t('soloDesc')}</div>
                            </div>
                        </button>

                        <button
                            className="menu-button multiplayer-button"
                            onMouseEnter={() => sound.playHoverSound()}
                            onClick={() => {
                                sound.playClickSound();
                                showToast('info', t('multiplayerComingSoon'));
                            }}
                        >
                            <div className="menu-button-icon">MP</div>
                            <div className="menu-button-content">
                                <div className="menu-button-title">{t('multiplayer')}</div>
                                <div className="menu-button-subtitle">{t('multiplayerDesc')}</div>
                            </div>
                        </button>

                        <button
                            className="menu-button config-button"
                            onMouseEnter={() => sound.playHoverSound()}
                            onClick={() => {
                                sound.playClickSound();
                                setCurrentScreen('customization');
                            }}
                        >
                            <div className="menu-button-icon">🎨</div>
                            <div className="menu-button-content">
                                <div className="menu-button-title">{t('customization')}</div>
                                <div className="menu-button-subtitle">{t('customizationDesc')}</div>
                            </div>
                        </button>

                        <button
                            className="menu-button marketplace-button"
                            onMouseEnter={() => sound.playHoverSound()}
                            onClick={() => {
                                sound.playClickSound();
                                setCurrentScreen('marketplace');
                            }}
                        >
                            <div className="menu-button-icon">🛒</div>
                            <div className="menu-button-content">
                                <div className="menu-button-title">{t('marketplace')}</div>
                                <div className="menu-button-subtitle">{t('marketplaceDesc')}</div>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Solo Game Screen */}
            {currentScreen === 'solo' && (
                <div className="solo-screen">
                    {/* Animated Background for Solo */}
                    <div className="grid-overlay solo-grid">
                        <div className="grid-lines-horizontal"></div>
                        <div className="grid-lines-vertical"></div>
                        <div className="light-pulse pulse-2"></div>
                        <div className="light-pulse pulse-4"></div>
                    </div>
                    <div className="floating-blocks">
                        <div className="tetris-block block-o"></div>
                        <div className="tetris-block block-s"></div>
                        <div className="tetris-block block-j"></div>
                    </div>

                    <button
                        className="btn btn-secondary back-button"
                        onClick={() => {
                            setCurrentScreen('menu');
                            setGameMode('menu');
                        }}
                    >
                        {t('backToMenu')}
                    </button>

                    <div className="main-content">
                        <div className="game-section">
                            {gameMode === 'menu' && (
                                <div className="menu-screen">
                                    <h2>{t('readyToPlay')}</h2>
                                    {!blockchain.account ? (
                                        <div className="wallet-required">
                                            <p className="status-message error">{t('walletRequired')}</p>
                                            <p className="wallet-required-text">{t('walletRequiredText')}</p>
                                            <ConnectButton />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="status-message connected">
                                                {t('walletConnected')}
                                            </p>
                                            <button
                                                onClick={handleStartGame}
                                                className="btn btn-primary start-button"
                                                disabled={blockchain.isCreatingGameSeed}
                                            >
                                                {blockchain.isCreatingGameSeed ? t('creatingGameSeed') : t('startGame')}
                                            </button>
                                        </>
                                    )}
                                    <div className="controls-info">
                                        <h3>{t('controls')}</h3>
                                        <p><span>{t('moveLeft')}</span> <kbd>←</kbd></p>
                                        <p><span>{t('moveRight')}</span> <kbd>→</kbd></p>
                                        <p><span>{t('rotate')}</span> <kbd>↑</kbd></p>
                                        <p><span>{t('softDropControl')}</span> <kbd>↓</kbd></p>
                                        <p><span>{t('hardDropControl')}</span> <kbd>SPACE</kbd></p>
                                        <p><span>{t('pause')}</span> <kbd>P</kbd></p>
                                    </div>
                                </div>
                            )}

                            {gameMode === 'playing' && (
                                <>
                                    <GameInfo
                                        score={game.gameState.score}
                                        level={game.gameState.level}
                                        lines={game.gameState.linesCleared}
                                        isPaused={game.gameState.isPaused}
                                        onPause={game.togglePause}
                                    />

                                    <div className="game-area-with-previews">
                                        {/* HOLD */}
                                        <div className="hold-container">
                                            <div className="preview-label">{t('hold')}</div>
                                            <PiecePreview
                                                pieceType={game.gameState.holdPiece?.type}
                                                skinColors={getSkinById(selectedSkin).colors}
                                            />
                                            <div className="preview-hint">{t('pressC')}</div>
                                        </div>

                                        {/* GAME BOARD */}
                                        <GameBoard
                                            grid={game.gameState.grid}
                                            currentPiece={game.gameState.currentPiece}
                                            ghostPiece={game.gameState.ghostPiece}
                                            isPaused={game.gameState.isPaused}
                                            clearingLines={game.clearingLines}
                                            renderTrigger={game.renderTrigger}
                                            skinColors={getSkinById(selectedSkin).colors}
                                        />

                                        {/* NEXT */}
                                        <div className="next-container">
                                            <div className="preview-label">{t('next')}</div>
                                            {game.gameState.nextQueue && game.gameState.nextQueue.slice(0, 4).map((type, i) => (
                                                <PiecePreview
                                                    key={i}
                                                    pieceType={type}
                                                    skinColors={getSkinById(selectedSkin).colors}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {gameMode === 'gameOver' && (
                                <div className="game-over">
                                    <h2>{t('gameOver')}</h2>
                                    <p>{t('finalScore')} <span>{game.gameState.score.toLocaleString()}</span></p>
                                    <div className="game-over-actions">
                                        {blockchain.account && gameSeedObjectId && (
                                            <button
                                                onClick={handleSubmitScore}
                                                className="btn btn-primary"
                                                disabled={blockchain.isSubmittingScore}
                                            >
                                                {blockchain.isSubmittingScore ? t('submitting') : t('submitToBlockchain')}
                                            </button>
                                        )}
                                        <button onClick={handlePlayAgain} className="btn btn-secondary">
                                            {t('playAgain')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="blockchain-section">
                            <WalletStatus 
                                t={t}
                                account={blockchain.account}
                                balance={blockchain.playerBalance}
                                isLoadingBalance={blockchain.isLoadingBalance}
                                onRefreshBalance={blockchain.fetchPlayerBalance}
                            />
                            <Leaderboard
                                scores={blockchain.leaderboard}
                                currentPlayerAddress={blockchain.account?.address}
                                isLoading={blockchain.isLoadingLeaderboard}
                                onRefresh={blockchain.fetchLeaderboard}
                                usernameMap={blockchain.account && blockchain.username ? {
                                    [blockchain.account.address]: blockchain.username
                                } : {}}
                                t={t}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Multiplayer Screen */}
            {currentScreen === 'multiplayer' && (
                <div className="multiplayer-screen">
                    <button
                        className="btn btn-secondary back-button"
                        onClick={() => {
                            battleFlow.resetBattle();
                            setCurrentScreen('menu');
                        }}
                    >
                        {t('backToMenu')}
                    </button>

                    {/* Show Battle View if in battle */}
                    {battleFlow.battleState === 'playing' && battleFlow.roomData ? (
                        <BattleView
                            localPlayer={{ username: blockchain.username, address: blockchain.account?.address }}
                            localGameState={multiplayerBattle.localGameState}
                            opponentPlayer={{ username: battleFlow.opponentData?.username, address: battleFlow.opponentData?.address }}
                            opponentGameState={multiplayerBattle.opponentGameState}
                            wager={battleFlow.roomData?.wager}
                            onForfeit={() => battleFlow.forfeitBattle()}
                        />
                    ) : (
                        /* Show Multiplayer Menu for matchmaking */
                        <MultiplayerMenu
                            onRandomMatchmaking={(wager) => battleFlow.startMatchmaking(wager)}
                            onPrivateRoom={(wager) => battleFlow.createPrivateRoom(wager)}
                            matchmakingStatus={battleFlow.battleState}
                            estimatedWaitTime={battleFlow.estimatedWaitTime}
                            onCancel={() => battleFlow.cancelMatchmaking()}
                        />
                    )}
                </div>
            )}

            {/* Customization Screen */}
            {currentScreen === 'customization' && (
                <CustomizationMenu
                    gameStats={gameStats}
                    onBack={() => setCurrentScreen('menu')}
                    onSkinSelect={handleSelectSkin}
                    t={t}
                />
            )}

            {/* Marketplace Screen */}
            {currentScreen === 'marketplace' && (
                <MarketplaceView
                    onBack={() => setCurrentScreen('menu')}
                    t={t}
                />
            )}

            {/* Username Registration Screen - Mandatory for first-time users */}
            {authState === AUTH_STATES.REGISTERING && (
                <div className="username-screen">
                    <UsernameRegistrationModal
                        isOpen={true}
                        onClose={() => {}} // No skip - username is mandatory
                        onRegister={async (username) => {
                            try {
                                await blockchain.registerUsername(username);
                                handleUsernameRegistered();
                            } catch (error) {
                                showToast('error', error.message || t('failedToRegisterUsername'));
                                throw error;
                            }
                        }}
                        isRegistering={blockchain.isRegisteringUsername}
                    />
                </div>
            )}

            {/* Loading Overlay */}
            {(blockchain.isCreatingGameSeed || blockchain.isSubmittingScore ||
              authState === AUTH_STATES.VERIFYING) && (
                <LoadingOverlay message={authState === AUTH_STATES.VERIFYING ? authMessage : loadingMessage} />
            )}

            {/* Toast Notifications */}
            {toast.show && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {/* Skin Unlock Notification */}
            <SkinUnlockNotification
                skin={skinUnlocks.newlyUnlocked}
                onClose={skinUnlocks.clearNotification}
                t={t}
            />
        </div>
    );
}

export default App;
