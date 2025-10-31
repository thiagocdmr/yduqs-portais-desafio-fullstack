import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import StudentForm from '../../pages/StudentForm';
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

// Mock do useEnrollment
vi.mock('../../contexts/EnrollmentContext', async () => {
    const actual = await vi.importActual('../../contexts/EnrollmentContext');
    return {
        ...actual,
        useEnrollment: vi.fn(),
    };
});

const mockCourse: Course = {
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

describe('StudentForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        vi.mocked(useEnrollment).mockReturnValue({
            selectedCourse: mockCourse,
            selectedInstallmentPlan: null,
            setSelectedCourse: vi.fn(),
            setSelectedInstallmentPlan: vi.fn(),
            clearEnrollment: vi.fn(),
        });
    });

    it('should render intro banner with correct title', () => {
        render(<StudentForm />);
        
        expect(screen.getByText('Queremos saber um pouco mais sobre você')).toBeInTheDocument();
    });

    it('should render student form fields', () => {
        render(<StudentForm />);
        
        // Verifica que os campos do formulário estão presentes
        expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    });

    it('should render both intro banner and form fields', () => {
        render(<StudentForm />);
        
        // Verifica que ambos os componentes estão presentes
        expect(screen.getByText('Queremos saber um pouco mais sobre você')).toBeInTheDocument();
        expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
    });
});
