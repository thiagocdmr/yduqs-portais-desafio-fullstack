import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import StudentFormFields from '../../components/StudentFormFields';
import { useEnrollment } from '../../contexts/EnrollmentContext';
import { enrollmentService } from '../../services/enrollmentService';
import type { Course } from '../../types/course';
import type { InstallmentPlan } from '../../types/installmentPlan';

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

// Mock do enrollmentService
vi.mock('../../services/enrollmentService', () => ({
    enrollmentService: {
        createEnrollment: vi.fn(),
    },
}));

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

const mockInstallmentPlan: InstallmentPlan = {
    id: 1,
    installments: 12,
    installmentValue: 450.00,
    totalPrice: 5400.00,
};

describe('StudentFormFields', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        vi.mocked(useEnrollment).mockReturnValue({
            selectedCourse: mockCourse,
            selectedInstallmentPlan: mockInstallmentPlan,
            setSelectedCourse: vi.fn(),
            setSelectedInstallmentPlan: vi.fn(),
            clearEnrollment: vi.fn(),
        });
    });

    describe('Form Fields Rendering', () => {
        it('should render all form fields', () => {
            render(<StudentFormFields />);

            expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Data de nascimento/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Celular/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Ano de conclusão do ensino médio/i)).toBeInTheDocument();
        });

        it('should render submit button', () => {
            render(<StudentFormFields />);

            expect(screen.getByRole('button', { name: /Avançar/i })).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('should show error for empty full name', async () => {
            const user = userEvent.setup();
            render(<StudentFormFields />);

            const nameInput = screen.getByLabelText(/Nome completo/i);
            await user.click(nameInput);
            await user.tab(); // Blur

            await waitFor(() => {
                expect(screen.getByText(/Nome completo é obrigatório/i)).toBeInTheDocument();
            });
        });

        it('should show error for invalid CPF', async () => {
            const user = userEvent.setup();
            render(<StudentFormFields />);

            const cpfInput = screen.getByLabelText(/CPF/i);
            await user.type(cpfInput, '111.111.111-11');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/CPF inválido/i)).toBeInTheDocument();
            });
        });

        it('should show error for invalid email', async () => {
            const user = userEvent.setup();
            render(<StudentFormFields />);

            const emailInput = screen.getByLabelText(/E-mail/i);
            await user.type(emailInput, 'invalid-email');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/E-mail inválido/i)).toBeInTheDocument();
            });
        });
    });

    describe('Form Submission', () => {
        it('should submit form with valid data', async () => {
            const user = userEvent.setup();
            const mockResponse = {
                id: 1,
                courseId: 1,
                installments: 12,
                installmentValue: 450.00,
                totalPrice: 5400.00,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    fullName: 'João Silva Santos',
                    cpf: '123.456.789-09',
                    birthDate: '1990-01-01',
                    email: 'joao@example.com',
                    phone: '(11) 98765-4321',
                    highSchoolCompletionYear: 2008,
                    agreeToTerms: true,
                    receiveWhatsappNotifications: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(enrollmentService.createEnrollment).mockResolvedValue(mockResponse);

            render(<StudentFormFields />);

            // Preenche todos os campos
            await user.type(screen.getByLabelText(/Nome completo/i), 'João Silva Santos');
            await user.type(screen.getByLabelText(/CPF/i), '123.456.789-09');
            await user.type(screen.getByLabelText(/Data de nascimento/i), '1990-01-01');
            await user.type(screen.getByLabelText(/E-mail/i), 'joao@example.com');
            await user.type(screen.getByLabelText(/Celular/i), '(11) 98765-4321');
            await user.type(screen.getByLabelText(/Ano de conclusão/i), '2008');

            // Marca o checkbox de termos (primeiro checkbox)
            const checkboxes = screen.getAllByRole('checkbox');
            await user.click(checkboxes[0]);

            // Submete o formulário
            const submitButton = screen.getByRole('button', { name: /Avançar/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(enrollmentService.createEnrollment).toHaveBeenCalled();
            });
        });

        it('should navigate to success page after submission', async () => {
            const user = userEvent.setup();
            const mockResponse = {
                id: 1,
                courseId: 1,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    fullName: 'João Silva Santos',
                    cpf: '123.456.789-09',
                    birthDate: '1990-01-01',
                    email: 'joao@example.com',
                    phone: '(11) 98765-4321',
                    highSchoolCompletionYear: 2008,
                    agreeToTerms: true,
                    receiveWhatsappNotifications: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(enrollmentService.createEnrollment).mockResolvedValue(mockResponse);

            render(<StudentFormFields />);

            // Preenche e submete
            await user.type(screen.getByLabelText(/Nome completo/i), 'João Silva Santos');
            await user.type(screen.getByLabelText(/CPF/i), '123.456.789-09');
            await user.type(screen.getByLabelText(/Data de nascimento/i), '1990-01-01');
            await user.type(screen.getByLabelText(/E-mail/i), 'joao@example.com');
            await user.type(screen.getByLabelText(/Celular/i), '(11) 98765-4321');
            await user.type(screen.getByLabelText(/Ano de conclusão/i), '2008');
            const checkboxes1 = screen.getAllByRole('checkbox');
            await user.click(checkboxes1[0]);
            await user.click(screen.getByRole('button', { name: /Avançar/i }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/success');
            });
        });

        it('should show error message on submission failure', async () => {
            const user = userEvent.setup();
            vi.mocked(enrollmentService.createEnrollment).mockRejectedValue(
                new Error('Erro ao processar matrícula')
            );

            render(<StudentFormFields />);

            // Preenche e submete
            await user.type(screen.getByLabelText(/Nome completo/i), 'João Silva Santos');
            await user.type(screen.getByLabelText(/CPF/i), '123.456.789-09');
            await user.type(screen.getByLabelText(/Data de nascimento/i), '1990-01-01');
            await user.type(screen.getByLabelText(/E-mail/i), 'joao@example.com');
            await user.type(screen.getByLabelText(/Celular/i), '(11) 98765-4321');
            await user.type(screen.getByLabelText(/Ano de conclusão/i), '2008');
            const checkboxes2 = screen.getAllByRole('checkbox');
            await user.click(checkboxes2[0]);
            await user.click(screen.getByRole('button', { name: /Avançar/i }));

            await waitFor(() => {
                expect(screen.getByText(/Erro ao processar/i)).toBeInTheDocument();
            });
        });
    });

    describe('Field Formatting', () => {
        it('should format CPF as user types', async () => {
            const user = userEvent.setup();
            render(<StudentFormFields />);

            const cpfInput = screen.getByLabelText(/CPF/i) as HTMLInputElement;
            await user.type(cpfInput, '12345678909');

            expect(cpfInput.value).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
        });

        it('should format phone as user types', async () => {
            const user = userEvent.setup();
            render(<StudentFormFields />);

            const phoneInput = screen.getByLabelText(/Celular/i) as HTMLInputElement;
            await user.type(phoneInput, '11987654321');

            expect(phoneInput.value).toMatch(/\(\d{2}\)\s\d{5}-\d{4}/);
        });
    });

    describe('Course Selection', () => {
        it('should redirect to home if no course selected', () => {
            vi.mocked(useEnrollment).mockReturnValue({
                selectedCourse: null,
                selectedInstallmentPlan: null,
                setSelectedCourse: vi.fn(),
                setSelectedInstallmentPlan: vi.fn(),
                clearEnrollment: vi.fn(),
            });

            render(<StudentFormFields />);

            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
