import { useEffect, useRef, useState } from 'react';

interface UseParallaxOptions {
    /** How much the element moves relative to scroll (default: 0.2). Positive = moves down, negative = moves up. */
    speed?: number;
    /** Axis of movement */
    axis?: 'y' | 'x';
}

/**
 * Hook that creates a parallax effect based on scroll position.
 * Returns a ref and a style to apply to the element.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(options: UseParallaxOptions = {}) {
    const { speed = 0.2, axis = 'y' } = options;
    const ref = useRef<T>(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (ref.current) {
                        const rect = ref.current.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        // Calculate how far through the viewport the element is
                        const elementCenter = rect.top + rect.height / 2;
                        const viewportCenter = windowHeight / 2;
                        const distanceFromCenter = elementCenter - viewportCenter;
                        setOffset(distanceFromCenter * speed);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial calc

        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    const style: React.CSSProperties = {
        transform: axis === 'y' ? `translateY(${offset}px)` : `translateX(${offset}px)`,
        willChange: 'transform',
    };

    return { ref, style };
}
