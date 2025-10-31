import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import IntroBanner from '../../components/IntroBanner';

describe('IntroBanner', () => {
    describe('Standard type', () => {
        it('should render title when provided', () => {
            render(<IntroBanner title="Test Title" />);
            expect(screen.getByText('Test Title')).toBeInTheDocument();
        });

        it('should render subtitle when provided', () => {
            render(<IntroBanner title="Test Title" subtitle="Test Subtitle" />);
            expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
        });

        it('should not render subtitle when not provided', () => {
            render(<IntroBanner title="Test Title" />);
            expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
        });

        it('should render title as h1', () => {
            render(<IntroBanner title="Test Title" />);
            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toHaveTextContent('Test Title');
        });

        it('should render subtitle as h2', () => {
            render(<IntroBanner title="Test Title" subtitle="Test Subtitle" />);
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveTextContent('Test Subtitle');
        });
    });

    describe('EaD type', () => {
        it('should render info icon for EaD type', () => {
            const { container } = render(<IntroBanner title="Test Title" type="EaD" />);
            const infoIcon = container.querySelector('svg[data-testid="InfoOutlineIcon"]');
            expect(infoIcon).toBeInTheDocument();
        });

        it('should render title for EaD type', () => {
            render(<IntroBanner title="EaD Course Info" type="EaD" />);
            expect(screen.getByText('EaD Course Info')).toBeInTheDocument();
        });

        it('should not render subtitle for EaD type even if provided', () => {
            render(<IntroBanner title="Test Title" subtitle="Test Subtitle" type="EaD" />);
            expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
        });
    });

    describe('Styling', () => {
        it('should have correct background color class', () => {
            const { container } = render(<IntroBanner title="Test Title" />);
            const section = container.querySelector('section');
            expect(section).toHaveClass('bg-primary-action-pure');
        });

        it('should have text-white class', () => {
            const { container } = render(<IntroBanner title="Test Title" />);
            const section = container.querySelector('section');
            expect(section).toHaveClass('text-white');
        });
    });
});
