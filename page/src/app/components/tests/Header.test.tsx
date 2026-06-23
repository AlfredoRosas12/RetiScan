import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '../Header';

describe('Header Component', () => {
    it('should render navigation links', () => {
        render(<Header />);
        expect(screen.getByText('Descubre')).toBeInTheDocument();
        expect(screen.getByText('Beneficios')).toBeInTheDocument();
        expect(screen.getByText('Suscripción')).toBeInTheDocument();
        expect(screen.getByText('Preguntas Frecuentes')).toBeInTheDocument();
    });

    it('should render logo text', () => {
        render(<Header />);
        expect(screen.getByText('RetiScan')).toBeInTheDocument();
    });
});
