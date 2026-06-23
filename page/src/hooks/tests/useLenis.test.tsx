import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLenis } from '../useLenis';

vi.mock('@/app/components/ui/use-mobile', () => ({
    useIsMobile: () => false,
}));

vi.mock('lenis', () => ({
    default: vi.fn().mockImplementation(() => ({
        raf: vi.fn(),
        destroy: vi.fn(),
    })),
}));

describe('useLenis', () => {
    it('should initialize without errors', () => {
        const { result } = renderHook(() => useLenis());
        expect(result.error).toBeUndefined();
    });
});
