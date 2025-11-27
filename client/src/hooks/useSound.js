import { useEffect, useRef, useState } from 'react';

/**
 * Hook for managing game sounds (BGM and sound effects)
 */
export function useSound() {
    const bgmRef = useRef(null);
    const hoverSoundRef = useRef(null);
    const clickSoundRef = useRef(null);
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('soundMuted') === 'true';
    });

    useEffect(() => {
        // Initialize BGM
        bgmRef.current = new Audio('/audio/bgm.mp3');
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.3; // 30% volume for BGM

        // Initialize hover sound (simple beep)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const createHoverSound = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
        hoverSoundRef.current = createHoverSound;

        // RETRO ARCADE CLICK - Like classic games!
        const createClickSound = () => {
            // Create a classic "coin" or "select" sound
            const osc1 = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Classic arcade frequencies - perfect fifth interval
            osc1.type = 'square'; // Retro square wave
            osc2.type = 'square';
            
            const now = audioContext.currentTime;
            
            // First note - high
            osc1.frequency.setValueAtTime(1046.5, now); // C6
            osc2.frequency.setValueAtTime(1568, now);   // G6
            
            // Quick pitch bend up for that arcade "bling"
            osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.05); // E6
            osc2.frequency.exponentialRampToValueAtTime(1976, now + 0.05);   // B6
            
            // Volume envelope - quick and punchy
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01); // Fast attack
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15); // Quick decay
            
            osc1.start(now);
            osc1.stop(now + 0.15);
            osc2.start(now);
            osc2.stop(now + 0.15);
        };
        clickSoundRef.current = createClickSound;

        // Auto-play BGM when component mounts (with user interaction)
        const playBGM = () => {
            if (!isMuted && bgmRef.current) {
                bgmRef.current.play().catch(err => {
                    console.log('BGM autoplay prevented:', err);
                });
            }
        };

        // Try to play after a small delay or on first user interaction
        const handleFirstInteraction = () => {
            playBGM();
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);

        return () => {
            if (bgmRef.current) {
                bgmRef.current.pause();
                bgmRef.current = null;
            }
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };
    }, []);

    // Update BGM mute state
    useEffect(() => {
        if (bgmRef.current) {
            if (isMuted) {
                bgmRef.current.pause();
            } else {
                bgmRef.current.play().catch(err => {
                    console.log('BGM play failed:', err);
                });
            }
        }
        localStorage.setItem('soundMuted', isMuted.toString());
    }, [isMuted]);

    const playHoverSound = () => {
        if (!isMuted && hoverSoundRef.current) {
            try {
                hoverSoundRef.current();
            } catch (err) {
                console.log('Hover sound failed:', err);
            }
        }
    };

    const playClickSound = () => {
        if (!isMuted && clickSoundRef.current) {
            try {
                clickSoundRef.current();
            } catch (err) {
                console.log('Click sound failed:', err);
            }
        }
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return {
        playHoverSound,
        playClickSound,
        toggleMute,
        isMuted,
    };
}
