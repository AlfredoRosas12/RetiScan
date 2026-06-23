import { useEffect } from 'react';
import Lenis from 'lenis';
import { useIsMobile } from '@/app/components/ui/use-mobile';

/**
 * Initializes Lenis smooth scroll globally.
 * Desktop: fast scroll (0.4s) for snappy feel.
 * Mobile: longer scroll (1.0s) for progressive reveal.
 */
export function useLenis() {
    const isMobile = useIsMobile();

    useEffect(() => {
        const lenis = new Lenis({
            duration: isMobile ? 1.0 : 0.4,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Expose lenis instance for programmatic scrolling
        (window as unknown as Record<string, unknown>).__lenis = lenis;

        return () => {
            lenis.destroy();
        };
    }, [isMobile]);
}
