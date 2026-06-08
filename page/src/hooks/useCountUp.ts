import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
    /** Duration of the count-up animation in ms */
    duration?: number;
    /** Number of decimal places */
    decimals?: number;
    /** Prefix (e.g., '$') */
    prefix?: string;
    /** Suffix (e.g., '%', '+', 'K+') */
    suffix?: string;
    /** Start counting when visible (uses IntersectionObserver) */
    startOnVisible?: boolean;
}

/**
 * Hook that animates a number counting from 0 to the target value.
 * Uses easeOutExpo for a natural deceleration feel.
 */
export function useCountUp(
    end: number,
    options: UseCountUpOptions = {}
) {
    const {
        duration = 2000,
        decimals = 0,
        prefix = '',
        suffix = '',
        startOnVisible = true,
    } = options;

    const ref = useRef<HTMLElement>(null);
    const [value, setValue] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    // Intersection Observer to trigger on visibility
    useEffect(() => {
        if (!startOnVisible) {
            setHasStarted(true);
            return;
        }

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [startOnVisible, hasStarted]);

    // Animation
    useEffect(() => {
        if (!hasStarted) return;

        let startTimestamp: number | null = null;
        let animationFrame: number;

        const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);

            setValue(easedProgress * end);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        };

        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, [hasStarted, end, duration]);

    const display = `${prefix}${value.toFixed(decimals)}${suffix}`;

    return { ref, display, value, isComplete: value >= end };
}
