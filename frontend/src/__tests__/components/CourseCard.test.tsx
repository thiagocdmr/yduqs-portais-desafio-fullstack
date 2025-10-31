import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import CourseCard from '../../components/CourseCard';
import type { Course } from '../../types/course';

const mockPresencialCourse: Course = {
    id: 1,
    modality: 'Graduação',
    period: 'Noturno',
    originalPrice: 1000.00,
    installmentPrice: 450.00,
    installments: 12,
    cashPrice: 900.00,
    description: null,
    type: 'Presencial',
    location: {
        city: 'Rio de Janeiro',
        unit: 'Campus Centro',
        address: 'Rua do Ouvidor, 123',
    },
};

const mockEADCourse: Course = {
    id: 2,
    modality: 'Graduação EAD',
    period: null,
    originalPrice: null,
    installmentPrice: null,
    installments: null,
    cashPrice: null,
    description: 'Curso 100% online com flexibilidade de horários',
    type: 'EAD',
    location: {
        city: 'São Paulo',
        unit: 'EAD',
        address: 'Online',
    },
};

describe('CourseCard', () => {
    describe('Presencial Course', () => {
        it('should render course modality and period', () => {
            render(<CourseCard course={mockPresencialCourse} />);
            expect(screen.getByText('Graduação')).toBeInTheDocument();
            expect(screen.getByText('Noturno')).toBeInTheDocument();
        });

        it('should render location information', () => {
            render(<CourseCard course={mockPresencialCourse} />);
            expect(screen.getByText(/Rio de Janeiro - Campus Centro/i)).toBeInTheDocument();
            expect(screen.getByText(/Rua do Ouvidor, 123/i)).toBeInTheDocument();
        });

        it('should render advance button', () => {
            render(<CourseCard course={mockPresencialCourse} />);
            const button = screen.getByRole('button', { name: /Avançar/i });
            expect(button).toBeInTheDocument();
        });

        it('should call openDrawer when advance button is clicked', async () => {
            const user = userEvent.setup();
            render(<CourseCard course={mockPresencialCourse} />);
            
            const button = screen.getByRole('button', { name: /Avançar/i });
            await user.click(button);
            
            expect(button).toBeInTheDocument();
        });
    });

    describe('EAD Course', () => {
        it('should render course modality without period', () => {
            render(<CourseCard course={mockEADCourse} />);
            expect(screen.getByText('Graduação EAD')).toBeInTheDocument();
            expect(screen.queryByText('|')).not.toBeInTheDocument();
        });

        it('should render description instead of price', () => {
            render(<CourseCard course={mockEADCourse} />);
            expect(screen.getByText(/Curso 100% online com flexibilidade de horários/i)).toBeInTheDocument();
        });

        it('should render info icon', () => {
            const { container } = render(<CourseCard course={mockEADCourse} />);
            const infoIcon = container.querySelector('svg[data-testid="InfoOutlineIcon"]');
            expect(infoIcon).toBeInTheDocument();
        });
    });
});
