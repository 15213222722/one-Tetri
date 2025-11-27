import { useState, useEffect, useRef } from 'react';
import { useGame } from './useGame.js';

/**
 * Hook for managing multiplayer Tetris battle
 * Uses the existing useGame hook for local gameplay
 * Syncs state with opponent via WebSocket
 */
export function useMultiplayerBattle(socket, roomData, opponentData) {
  const [opponentGameState, setOpponentGameState] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Use room ID as seed so both players get same pieces
  const gameSeed = roomData?.roomId;
  
  // Use the same game hook as solo mode
  const localGame = useGame(gameSeed);
  
  const syncIntervalRef = useRef(null);

  // Start the game when room is ready
  useEffect(() => {
    if (!roomData || !localGame) return;

    console.log('🎮 Starting multiplayer battle with seed:', gameSeed);
    localGame.startGame();

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [roomData, localGame, gameSeed]);

  // Sync game state to opponent periodically
  useEffect(() => {
    if (!socket || !roomData || !localGame.gameState) return;

    // Send state updates every 100ms
    syncIntervalRef.current = setInterval(() => {
      if (localGame.gameState && !localGame.gameState.isGameOver) {
        socket.emit('game:state_update', {
          roomId: roomData.roomId,
          state: {
            grid: localGame.gameState.grid,
            score: localGame.gameState.score,
            linesCleared: localGame.gameState.linesCleared,
            level: localGame.gameState.level,
            currentPiece: localGame.gameState.currentPiece,
            nextQueue: localGame.gameState.nextQueue,
            holdPiece: localGame.gameState.holdPiece,
            piecesPlaced: localGame.gameState.piecesPlaced || 0,
          },
        });
      }
    }, 100);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [socket, roomData, localGame.gameState]);

  // Check for game over
  useEffect(() => {
    if (localGame.gameState?.isGameOver && !isGameOver) {
      console.log('😢 Local player lost!');
      setIsGameOver(true);
      setWinner('opponent');
      
      if (socket && roomData) {
        socket.emit('game:over', {
          roomId: roomData.roomId,
          winner: 'opponent',
        });
      }
    }
  }, [localGame.gameState?.isGameOver, isGameOver, socket, roomData]);

  // Listen for opponent's game state
  useEffect(() => {
    if (!socket) return;

    const handleOpponentState = (data) => {
      console.log('📡 Received opponent state:', data.state.score);
      setOpponentGameState(data.state);
    };

    const handleOpponentGameOver = () => {
      console.log('🎉 Opponent lost!');
      setIsGameOver(true);
      setWinner('local');
    };

    console.log('📡 Listening for opponent updates');
    socket.on('game:opponent_state', handleOpponentState);
    socket.on('game:opponent_game_over', handleOpponentGameOver);

    return () => {
      socket.off('game:opponent_state', handleOpponentState);
      socket.off('game:opponent_game_over', handleOpponentGameOver);
    };
  }, [socket]);



  return {
    localGame,
    localGameState: localGame.gameState,
    opponentGameState,
    isGameOver,
    winner,
  };
}
