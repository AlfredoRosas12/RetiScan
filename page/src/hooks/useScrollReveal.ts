import { useEffect, useRef, useState } from 'react';

type RevealEffect = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade';

interface UseScrollRevealOptions {
    threshold?: number;
    rootMargin?: string;
    /** Delay in ms before animation starts */
    delay?: number;
    /** Only animate once */
    once?: boolean;
}

/**
 * Hook that reveals an element with a DRAMATIC animation when it enters the viewport.
 * Uses large translateY/X values and slow cubic-bezier for premium feel.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    effect: RevealEffect = 'fade-up',
    options: UseScrollRevealOptions = {}
) {
    const { threshold = 0.1, rootMargin = '0px 0px -60px 0px', delay = 0, once = true } = options;
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay > 0) {
                        setTimeout(() => setIsVisible(true), delay);
                    } else {
                        setIsVisible(true);
                    }
                    if (once) observer.unobserve(element);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        // Fallback: Check if element is already in view on mount (e.g. Hero section)
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (delay > 0) {
                setTimeout(() => setIsVisible(true), delay);
            } else {
                setIsVisible(true);
            }
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin, delay, once]);

    // DRAMATIC transitions — 1.2s duration, aggressive easing
    const baseStyles: React.CSSProperties = {
        transition: `opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    };

    // BIG movements — 80-100px instead of 40px
    const hiddenStyles: Record<RevealEffect, React.CSSProperties> = {
        'fade-up': { opacity: 0, transform: 'translateY(80px)' },
        'fade-down': { opacity: 0, transform: 'translateY(-80px)' },
        'fade-left': { opacity: 0, transform: 'translateX(-100px)' },
        'fade-right': { opacity: 0, transform: 'translateX(100px)' },
        'zoom-in': { opacity: 0, transform: 'scale(0.7)' },
        'fade': { opacity: 0, transform: 'none' },
    };

    const visibleStyles: React.CSSProperties = {
        opacity: 1,
        transform: 'translateY(0) translateX(0) scale(1)',
    };

    const style: React.CSSProperties = {
        ...baseStyles,
        ...(isVisible ? visibleStyles : hiddenStyles[effect]),
    };

    return { ref, style, isVisible };
}
