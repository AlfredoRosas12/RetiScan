import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/app/components/ui/use-mobile';

interface SplitTextProps {
    children: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    className?: string;
    /** Delay before first word starts (ms) */
    baseDelay?: number;
    /** Delay between each word (ms) */
    stagger?: number;
}

/**
 * Splits text into individual words with stagger animation on mobile.
 * On desktop, uses a simple fade-in for better performance.
 */
export function SplitText({
    children,
    as: Tag = 'h2',
    className = '',
    baseDelay = 0,
    stagger = 80,
}: SplitTextProps) {
    const isMobile = useIsMobile();
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    // Desktop: simple fade-in (no word splitting)
    if (!isMobile) {
        return (
            <Tag
                ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
                className={className}
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                    transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay}ms`,
                }}
            >
                {children}
            </Tag>
        );
    }

    // Mobile: word-by-word animation (original behavior)
    const words = children.split(' ');

    return (
        <Tag
            ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
            className={`${className}`}
        >
            {words.map((word, i) => (
                <span
                    key={i}
                    className="inline-block overflow-hidden mr-[0.3em] pb-4 -mb-4"
                >
                    <span
                        className="inline-block"
                        style={{
                            transform: isVisible ? 'translateY(0) rotate(0deg)' : 'translateY(110%) rotate(5deg)',
                            opacity: isVisible ? 1 : 0,
                            transition: `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + i * stagger}ms, opacity 0.6s ease ${baseDelay + i * stagger}ms`,
                        }}
                    >
                        {word}
                    </span>
                </span>
            ))}
        </Tag>
    );
}
