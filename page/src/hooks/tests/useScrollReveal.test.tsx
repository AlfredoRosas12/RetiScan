import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useScrollReveal } from '../useScrollReveal';

vi.mock('@/app/components/ui/use-mobile', () => ({
    useIsMobile: () => false,
}));

describe('useScrollReveal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return ref, style, and isVisible', () => {
        const { result } = renderHook(() => useScrollReveal());
        expect(result.current.ref).toBeDefined();
        expect(result.current.style).toBeDefined();
        expect(typeof result.current.isVisible).toBe('boolean');
    });

    it('should apply desktop fast transitions when not mobile', () => {
        const { result } = renderHook(() => useScrollReveal());
        expect(result.current.style.transition).toContain('0.35s');
        expect(result.current.style.transition).toContain('0.4s');
    });

    it('should use smaller transform values on desktop', () => {
        const { result } = renderHook(() => useScrollReveal('fade-up'));
        const hiddenStyle = result.current.style.transform;
        expect(hiddenStyle).toContain('30px');
    });
});
