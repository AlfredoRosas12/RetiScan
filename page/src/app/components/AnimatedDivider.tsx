import { useScrollReveal } from '@/hooks/useScrollReveal';

interface AnimatedDividerProps {
    className?: string;
    /** Color of the line gradient */
    color?: 'cyan' | 'blue' | 'white';
}

/**
 * A horizontal line that "draws" itself from left to right
 * when it enters the viewport.
 */
export function AnimatedDivider({ className = '', color = 'cyan' }: AnimatedDividerProps) {
    const reveal = useScrollReveal('fade', { threshold: 0.5 });

    const gradients = {
        cyan: 'from-transparent via-cyan-500 to-transparent',
        blue: 'from-transparent via-blue-500 to-transparent',
        white: 'from-transparent via-white/30 to-transparent',
    };

    return (
        <div ref={reveal.ref} className={`relative py-4 ${className}`}>
            <div className="max-w-4xl mx-auto px-6 overflow-hidden">
                <div
                    className={`h-px bg-gradient-to-r ${gradients[color]}`}
                    style={{
                        transform: reveal.isVisible ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        transformOrigin: 'left center',
                    }}
                />
            </div>
        </div>
    );
}
