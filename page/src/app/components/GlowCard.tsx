import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from 'react';

interface GlowCardProps {
    children: ReactNode;
    className?: string;
    /** Glow color in CSS format (default: rgba(0, 204, 255, 0.15)) */
    glowColor?: string;
}

/**
 * A card with a radial gradient glow that follows the cursor.
 * The glow appears on hover and tracks mouse position along the border.
 */
export function GlowCard({ children, className = '', glowColor = 'rgba(0, 204, 255, 0.15)' }: GlowCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setGlowPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    return (
        <div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glow effect overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(600px circle at ${glowPosition.x}px ${glowPosition.y}px, ${glowColor}, transparent 40%)`,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
