import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Header from '../../components/Header';

describe('Header', () => {
    it('should render the logo', () => {
        render(<Header />);
        const logo = screen.getByAltText('Logo Estácio');
        expect(logo).toBeInTheDocument();
    });

    it('should have a link to home page', () => {
        render(<Header />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/');
    });

    it('should render logo as an image', () => {
        render(<Header />);
        const logo = screen.getByAltText('Logo Estácio');
        expect(logo).toHaveAttribute('src');
        expect(logo.tagName).toBe('IMG');
    });

    it('should have correct logo src path', () => {
        render(<Header />);
        const logo = screen.getByAltText('Logo Estácio') as HTMLImageElement;
        expect(logo.src).toContain('logo');
    });
});
