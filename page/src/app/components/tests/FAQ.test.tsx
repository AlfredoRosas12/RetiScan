import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FAQ } from '../FAQ';

describe('FAQ Component', () => {
    it('should render all FAQ questions', () => {
        render(<FAQ />);
        expect(screen.getByText('¿Qué es RetiScan?')).toBeInTheDocument();
        expect(screen.getByText(/¿Debo instalar alguna aplicación/)).toBeInTheDocument();
    });

    it('should toggle FAQ answer on click', () => {
        render(<FAQ />);
        const firstQuestion = screen.getByText('¿Qué es RetiScan?');
        fireEvent.click(firstQuestion);
        expect(screen.getByText(/plataforma inteligente/)).toBeInTheDocument();
    });
});
