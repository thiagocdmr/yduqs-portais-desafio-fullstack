import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import CourseGrid from '../../components/CourseGrid';
import { useCourses } from '../../contexts/CourseContext';
import type { Course } from '../../types/course';

// Mock do useCourses
vi.mock('../../contexts/CourseContext', async () => {
    const actual = await vi.importActual('../../contexts/CourseContext');
    return {
        ...actual,
        useCourses: vi.fn(),
    };
});

const mockCourses: Course[] = [
    {
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
    },
    {
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
    },
];

describe('CourseGrid', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render loading state', () => {
        vi.mocked(useCourses).mockReturnValue({
            courses: [],
            loading: true,
            error: null,
            refetch: vi.fn(),
        });

        render(<CourseGrid />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render error state', () => {
        const errorMessage = 'Erro ao carregar cursos';
        vi.mocked(useCourses).mockReturnValue({
            courses: [],
            loading: false,
            error: errorMessage,
            refetch: vi.fn(),
        });

        render(<CourseGrid />);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should render courses with correct count (plural)', () => {
        vi.mocked(useCourses).mockReturnValue({
            courses: mockCourses,
            loading: false,
            error: null,
            refetch: vi.fn(),
        });

        render(<CourseGrid />);
        expect(screen.getByText('2 opções encontradas')).toBeInTheDocument();
    });

    it('should render courses with correct count (singular)', () => {
        vi.mocked(useCourses).mockReturnValue({
            courses: [mockCourses[0]],
            loading: false,
            error: null,
            refetch: vi.fn(),
        });

        render(<CourseGrid />);
        expect(screen.getByText('1 opção encontrada')).toBeInTheDocument();
    });

    it('should render all course cards', () => {
        vi.mocked(useCourses).mockReturnValue({
            courses: mockCourses,
            loading: false,
            error: null,
            refetch: vi.fn(),
        });

        render(<CourseGrid />);
        expect(screen.getByText('Graduação')).toBeInTheDocument();
        expect(screen.getByText('Graduação EAD')).toBeInTheDocument();
    });

    it('should render empty state when no courses', () => {
        vi.mocked(useCourses).mockReturnValue({
            courses: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
        });

        render(<CourseGrid />);
        expect(screen.getByText('0 opções encontradas')).toBeInTheDocument();
    });
});
