import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/app/components/ui/use-mobile';

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
 * Hook that reveals an element when it enters the viewport.
 * Desktop: fast transitions (0.3s), small movements (30px)
 * Mobile: dramatic transitions (1.0s), large movements (80px)
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    effect: RevealEffect = 'fade-up',
    options: UseScrollRevealOptions = {}
) {
    const isMobile = useIsMobile();
    const { threshold = 0.1, rootMargin, delay = 0, once = true } = options;

    // Responsive defaults
    const effectiveRootMargin = rootMargin ?? (isMobile ? '0px 0px -60px 0px' : '0px 0px -20px 0px');
    const effectiveThreshold = isMobile ? threshold : Math.min(threshold + 0.1, 0.3);

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
            { threshold: effectiveThreshold, rootMargin: effectiveRootMargin }
        );

        observer.observe(element);

        // Fallback: Check if element is already in view on mount
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (delay > 0) {
                setTimeout(() => setIsVisible(true), delay);
            } else {
                setIsVisible(true);
            }
        }

        return () => observer.disconnect();
    }, [effectiveThreshold, effectiveRootMargin, delay, once]);

    // Responsive transitions
    const duration = isMobile ? '1s' : '0.35s';
    const transformDuration = isMobile ? '1.2s' : '0.4s';

    const baseStyles: React.CSSProperties = {
        transition: `opacity ${duration} cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${transformDuration} cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    };

    // Responsive transform values
    const mobileOffset = 80;
    const desktopOffset = 30;
    const offset = isMobile ? mobileOffset : desktopOffset;

    const hiddenStyles: Record<RevealEffect, React.CSSProperties> = {
        'fade-up': { opacity: 0, transform: `translateY(${offset}px)` },
        'fade-down': { opacity: 0, transform: `translateY(-${offset}px)` },
        'fade-left': { opacity: 0, transform: `translateX(-${offset + 20}px)` },
        'fade-right': { opacity: 0, transform: `translateX(${offset + 20}px)` },
        'zoom-in': { opacity: 0, transform: isMobile ? 'scale(0.7)' : 'scale(0.92)' },
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
