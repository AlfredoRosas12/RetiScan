import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from 'react';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    /** How strong the magnetic pull is (default: 0.3) */
    strength?: number;
    onClick?: () => void;
}

/**
 * A button that subtly follows the cursor when hovered,
 * creating a "magnetic" attraction effect.
 */
export function MagneticButton({
    children,
    className = '',
    strength = 0.3,
    onClick,
    href,
    ...props
}: MagneticButtonProps & { href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const ref = useRef<HTMLElement>(null);
    const [transform, setTransform] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        setTransform({ x: deltaX, y: deltaY });
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        setTransform({ x: 0, y: 0 });
    }, []);

    const commonProps = {
        className,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        style: {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
            transition: transform.x === 0 && transform.y === 0
                ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                : 'transform 0.15s ease-out',
        },
        ...props
    };

    if (href) {
        return (
            <a
                ref={ref as React.RefObject<HTMLAnchorElement>}
                href={href}
                onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
                {...commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            ref={ref as React.RefObject<HTMLButtonElement>}
            onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
            {...commonProps as React.ButtonHTMLAttributes<HTMLButtonElement>}
        >
            {children}
        </button>
    );
}
