import { useRef, useEffect, type ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface TextRevealProps {
    children: ReactNode;
    /** Tag to render */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
    className?: string;
    /** Delay before animation starts (ms) */
    delay?: number;
}

/**
 * Wraps text in a clip-path reveal animation.
 * Each child line slides up from behind a mask for a cinematic effect.
 */
export function TextReveal({ children, as: Tag = 'div', className = '', delay = 0 }: TextRevealProps) {
    const reveal = useScrollReveal('fade', { delay });
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (reveal.isVisible && innerRef.current) {
            innerRef.current.style.transform = 'translateY(0)';
            innerRef.current.style.opacity = '1';
        }
    }, [reveal.isVisible]);

    return (
        <div
            ref={reveal.ref}
            style={{
                overflow: 'hidden',
                ...reveal.style,
                // Override the fade style — we handle visibility through clip
                opacity: 1,
                transform: 'none',
            }}
        >
            <Tag
                ref={innerRef as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLDivElement & HTMLSpanElement>}
                className={className}
                style={{
                    transform: reveal.isVisible ? 'translateY(0)' : 'translateY(100%)',
                    opacity: reveal.isVisible ? 1 : 0,
                    transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.6s ease ${delay}ms`,
                }}
            >
                {children}
            </Tag>
        </div>
    );
}
