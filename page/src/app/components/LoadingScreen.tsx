import { useState, useEffect } from 'react';
import { RetiScanLogo } from '@/app/components/RetiScanLogo';

export function LoadingScreen() {
    const [fadeOut, setFadeOut] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0); // 0: logo appears, 1: scanning, 2: text appears

    useEffect(() => {
        // Phase sequencing
        const p1 = setTimeout(() => setPhase(1), 400);  // Start scanning
        const p2 = setTimeout(() => setPhase(2), 1200);  // Show text + bar

        // Smooth progress counter
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                // Accelerating curve
                const remaining = 100 - prev;
                const step = Math.max(0.5, remaining * 0.04);
                return Math.min(100, prev + step);
            });
        }, 30);

        // Start fade-out after 3s
        const fadeTimer = setTimeout(() => {
            setProgress(100);
            setFadeOut(true);
        }, 3000);
        // Fully remove
        const hideTimer = setTimeout(() => setHidden(true), 3800);

        return () => {
            clearTimeout(p1);
            clearTimeout(p2);
            clearInterval(interval);
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (hidden) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-[800ms] ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            style={{
                background: 'linear-gradient(135deg, #000d26 0%, #001a4d 30%, #0033a0 60%, #001a4d 85%, #000d26 100%)',
            }}
        >
            {/* ===== BACKGROUND EFFECTS ===== */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated radial gradient center glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,204,255,0.15) 0%, transparent 70%)',
                        animation: 'breathe 3s ease-in-out infinite',
                    }}
                ></div>

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                        style={{
                            left: `${10 + (i * 37) % 80}%`,
                            top: `${5 + (i * 53) % 90}%`,
                            animation: `floatParticle ${3 + (i % 4)}s ease-in-out infinite`,
                            animationDelay: `${(i * 0.3) % 2}s`,
                        }}
                    ></div>
                ))}

                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `linear-gradient(rgba(0,204,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,204,255,0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}></div>

                {/* Horizontal scan line */}
                {phase >= 1 && (
                    <div
                        className="absolute left-0 right-0 h-[2px]"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(0,204,255,0.6), rgba(255,255,255,0.8), rgba(0,204,255,0.6), transparent)',
                            animation: 'scanLine 2s ease-in-out infinite',
                            boxShadow: '0 0 20px rgba(0,204,255,0.5), 0 0 60px rgba(0,204,255,0.2)',
                        }}
                    ></div>
                )}
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div className="relative flex flex-col items-center">
                {/* Logo with effects */}
                <div
                    className="relative transition-all duration-700 ease-out"
                    style={{
                        transform: phase >= 0 ? 'scale(1)' : 'scale(0.5)',
                        opacity: phase >= 0 ? 1 : 0,
                    }}
                >
                    {/* Outer pulse ring */}
                    <div
                        className="absolute inset-[-30px] rounded-full"
                        style={{
                            border: '1px solid rgba(0,204,255,0.2)',
                            animation: 'ripple 2s ease-out infinite',
                        }}
                    ></div>
                    <div
                        className="absolute inset-[-30px] rounded-full"
                        style={{
                            border: '1px solid rgba(0,204,255,0.2)',
                            animation: 'ripple 2s ease-out infinite 1s',
                        }}
                    ></div>

                    {/* Glow behind logo */}
                    <div
                        className="absolute inset-[-10px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(0,204,255,0.3) 0%, transparent 70%)',
                            animation: 'breathe 2s ease-in-out infinite',
                        }}
                    ></div>

                    {/* The SVG Logo */}
                    <div className="relative w-40 h-44 flex items-center justify-center drop-shadow-[0_0_40px_rgba(0,204,255,0.4)]">
                        <RetiScanLogo
                            size={150}
                            color="#ffffff"
                            irisColor="#00ccff"
                            pupilColor="#001a4d"
                            highlightColor="#ffffff"
                            animateScan
                            animatePulse
                        />
                    </div>
                </div>

                {/* Progress section — appears in phase 2 */}
                <div
                    className="flex flex-col items-center gap-5 mt-6 transition-all duration-500 ease-out"
                    style={{
                        opacity: phase >= 2 ? 1 : 0,
                        transform: phase >= 2 ? 'translateY(0)' : 'translateY(15px)',
                    }}
                >
                    {/* Progress bar */}
                    <div className="w-56 h-[3px] bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full rounded-full transition-all duration-100 ease-out"
                            style={{
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #00ccff, #ffffff, #00ccff)',
                                boxShadow: '0 0 10px rgba(0,204,255,0.5)',
                            }}
                        ></div>
                    </div>

                    {/* Loading text + percentage */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-white/60 tracking-[0.4em] uppercase">
                            Cargando
                        </span>
                        <span className="text-xs font-mono text-cyan-400 w-8 text-right tabular-nums">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    {/* Bouncing dots */}
                    <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }}></span>
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.8s' }}></span>
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.8s' }}></span>
                    </div>
                </div>
            </div>

            {/* ===== KEYFRAMES ===== */}
            <style>{`
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes scanLine {
          0% { top: 15%; }
          50% { top: 85%; }
          100% { top: 15%; }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-15px) translateX(5px); opacity: 0.8; }
          50% { transform: translateY(-5px) translateX(-5px); opacity: 0.4; }
          75% { transform: translateY(-20px) translateX(3px); opacity: 0.7; }
        }
      `}</style>
        </div>
    );
}
