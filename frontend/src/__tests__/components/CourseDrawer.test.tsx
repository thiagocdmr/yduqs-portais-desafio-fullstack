import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import CourseDrawer from '../../components/CourseDrawer';
import { useDrawer } from '../../contexts/DrawerContext';
import { useEnrollment } from '../../contexts/EnrollmentContext';
import type { Course } from '../../types/course';

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock dos contextos
vi.mock('../../contexts/DrawerContext', async () => {
    const actual = await vi.importActual('../../contexts/DrawerContext');
    return {
        ...actual,
        useDrawer: vi.fn(),
    };
});

vi.mock('../../contexts/EnrollmentContext', async () => {
    const actual = await vi.importActual('../../contexts/EnrollmentContext');
    return {
        ...actual,
        useEnrollment: vi.fn(),
    };
});

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
    description: 'Curso 100% online',
    type: 'EAD',
    location: {
        city: 'São Paulo',
        unit: 'EAD',
        address: 'Online',
    },
};

describe('CourseDrawer', () => {
    const mockCloseDrawer = vi.fn();
    const mockSetSelectedCourse = vi.fn();
    const mockSetSelectedInstallmentPlan = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        vi.mocked(useEnrollment).mockReturnValue({
            selectedCourse: null,
            selectedInstallmentPlan: null,
            setSelectedCourse: mockSetSelectedCourse,
            setSelectedInstallmentPlan: mockSetSelectedInstallmentPlan,
            clearEnrollment: vi.fn(),
        });
    });

    it('should return null when no course is selected', () => {
        vi.mocked(useDrawer).mockReturnValue({
            isOpen: true,
            selectedCourse: null,
            openDrawer: vi.fn(),
            closeDrawer: mockCloseDrawer,
        });

        const { container } = render(<CourseDrawer />);
        expect(container.firstChild).toBeNull();
    });

    it('should render drawer when open with presencial course', () => {
        vi.mocked(useDrawer).mockReturnValue({
            isOpen: true,
            selectedCourse: mockPresencialCourse,
            openDrawer: vi.fn(),
            closeDrawer: mockCloseDrawer,
        });

        render(<CourseDrawer />);
        expect(screen.getByText('Mais detalhes')).toBeInTheDocument();
    });

    it('should render drawer when open with EAD course', () => {
        vi.mocked(useDrawer).mockReturnValue({
            isOpen: true,
            selectedCourse: mockEADCourse,
            openDrawer: vi.fn(),
            closeDrawer: mockCloseDrawer,
        });

        render(<CourseDrawer />);
        expect(screen.getByText('Mais detalhes')).toBeInTheDocument();
        expect(screen.getByText(/Inscreva-se para saber tudo sobre os valores/i)).toBeInTheDocument();
    });

    it('should close drawer when close button is clicked', async () => {
        const user = userEvent.setup();
        vi.mocked(useDrawer).mockReturnValue({
            isOpen: true,
            selectedCourse: mockPresencialCourse,
            openDrawer: vi.fn(),
            closeDrawer: mockCloseDrawer,
        });

        render(<CourseDrawer />);
        const closeButton = screen.getByRole('button', { name: '' });
        await user.click(closeButton);

        expect(mockCloseDrawer).toHaveBeenCalled();
    });

    it('should navigate to student form when advance button is clicked', async () => {
        const user = userEvent.setup();
        vi.mocked(useDrawer).mockReturnValue({
            isOpen: true,
            selectedCourse: mockPresencialCourse,
            openDrawer: vi.fn(),
            closeDrawer: mockCloseDrawer,
        });

        render(<CourseDrawer />);
        const advanceButton = screen.getByRole('button', { name: /Avançar/i });
        await user.click(advanceButton);

        expect(mockSetSelectedCourse).toHaveBeenCalledWith(mockPresencialCourse);
        expect(mockCloseDrawer).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/student-form');
    });

    it('should set installment plan to null for EAD courses', async () => {
        const user = userEvent.setup();
        vi.mocked(useDrawer).mockReturnValue({
            isOpen: true,
            selectedCourse: mockEADCourse,
            openDrawer: vi.fn(),
            closeDrawer: mockCloseDrawer,
        });

        render(<CourseDrawer />);
        const advanceButton = screen.getByRole('button', { name: /Avançar/i });
        await user.click(advanceButton);

        expect(mockSetSelectedCourse).toHaveBeenCalledWith(mockEADCourse);
        expect(mockSetSelectedInstallmentPlan).toHaveBeenCalledWith(null);
        expect(mockCloseDrawer).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/student-form');
    });

    it('should render drawer info sections', () => {
        vi.mocked(useDrawer).mockReturnValue({
            isOpen: true,
            selectedCourse: mockPresencialCourse,
            openDrawer: vi.fn(),
            closeDrawer: mockCloseDrawer,
        });

        render(<CourseDrawer />);
        expect(screen.getByText('Sobre a bolsa incentivo')).toBeInTheDocument();
        expect(screen.getByText('Resumo das suas escolhas')).toBeInTheDocument();
    });
});
