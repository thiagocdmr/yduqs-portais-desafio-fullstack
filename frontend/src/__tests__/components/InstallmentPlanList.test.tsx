import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import InstallmentPlanList from '../../components/InstallmentPlanList';
import { courseService } from '../../services/courseService';
import { useEnrollment } from '../../contexts/EnrollmentContext';
import type { InstallmentPlan } from '../../types/installmentPlan';

// Mock do courseService
vi.mock('../../services/courseService', () => ({
    courseService: {
        getInstallmentPlans: vi.fn(),
    },
}));

// Mock do useEnrollment
vi.mock('../../contexts/EnrollmentContext', async () => {
    const actual = await vi.importActual('../../contexts/EnrollmentContext');
    return {
        ...actual,
        useEnrollment: vi.fn(),
    };
});

const mockInstallmentPlans: InstallmentPlan[] = [
    {
        id: 1,
        installments: 12,
        installmentValue: 450.00,
        totalPrice: 5400.00,
    },
    {
        id: 2,
        installments: 24,
        installmentValue: 250.00,
        totalPrice: 6000.00,
    },
    {
        id: 3,
        installments: 36,
        installmentValue: 180.00,
        totalPrice: 6480.00,
    },
];

describe('InstallmentPlanList', () => {
    const mockSetSelectedInstallmentPlan = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        vi.mocked(useEnrollment).mockReturnValue({
            selectedCourse: null,
            selectedInstallmentPlan: null,
            setSelectedCourse: vi.fn(),
            setSelectedInstallmentPlan: mockSetSelectedInstallmentPlan,
            clearEnrollment: vi.fn(),
        });
    });

    it('should render loading state', () => {
        vi.mocked(courseService.getInstallmentPlans).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        render(<InstallmentPlanList courseId={1} />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should fetch installment plans on mount', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(courseService.getInstallmentPlans).toHaveBeenCalledWith(1);
        });
    });

    it('should render title when plans are loaded', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(screen.getByText('Qual dessas opções de parcelas você prefere?')).toBeInTheDocument();
        });
    });

    it('should render all installment plans', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(screen.getByText(/12x/)).toBeInTheDocument();
            expect(screen.getByText(/24x/)).toBeInTheDocument();
            expect(screen.getByText(/36x/)).toBeInTheDocument();
        });
    });

    it('should format currency correctly', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(screen.getByText(/R\$\s*450,00/)).toBeInTheDocument();
            expect(screen.getByText(/R\$\s*5\.400,00/)).toBeInTheDocument();
        });
    });

    it('should select last plan by default', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(mockSetSelectedInstallmentPlan).toHaveBeenCalledWith(mockInstallmentPlans[2]);
        });
    });

    it('should allow selecting different plan', async () => {
        const user = userEvent.setup();
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(screen.getByText(/12x/)).toBeInTheDocument();
        });

        // Seleciona o primeiro plano
        const firstPlanRadio = screen.getByRole('radio', { name: /12x/ });
        await user.click(firstPlanRadio);

        expect(mockSetSelectedInstallmentPlan).toHaveBeenCalledWith(mockInstallmentPlans[0]);
    });

    it('should render table headers', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(screen.getByText('Parcelas')).toBeInTheDocument();
            expect(screen.getByText('Total')).toBeInTheDocument();
        });
    });

    it('should render nothing when no plans available', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue([]);

        const { container } = render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });
    });

    it('should handle fetch error gracefully', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.mocked(courseService.getInstallmentPlans).mockRejectedValue(new Error('API Error'));

        const { container } = render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it('should refetch when courseId changes', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        const { rerender } = render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            expect(courseService.getInstallmentPlans).toHaveBeenCalledWith(1);
        });

        vi.clearAllMocks();
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        rerender(<InstallmentPlanList courseId={2} />);

        await waitFor(() => {
            expect(courseService.getInstallmentPlans).toHaveBeenCalledWith(2);
        });
    });

    it('should render radio buttons for all plans', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            const radios = screen.getAllByRole('radio');
            expect(radios).toHaveLength(3);
        });
    });

    it('should display installment and total values for each plan', async () => {
        vi.mocked(courseService.getInstallmentPlans).mockResolvedValue(mockInstallmentPlans);

        render(<InstallmentPlanList courseId={1} />);

        await waitFor(() => {
            // Verifica primeiro plano
            expect(screen.getByText(/12x/)).toBeInTheDocument();
            expect(screen.getByText(/R\$\s*450,00/)).toBeInTheDocument();
            expect(screen.getByText(/R\$\s*5\.400,00/)).toBeInTheDocument();

            // Verifica segundo plano
            expect(screen.getByText(/24x/)).toBeInTheDocument();
            expect(screen.getByText(/R\$\s*250,00/)).toBeInTheDocument();
            expect(screen.getByText(/R\$\s*6\.000,00/)).toBeInTheDocument();

            // Verifica terceiro plano
            expect(screen.getByText(/36x/)).toBeInTheDocument();
            expect(screen.getByText(/R\$\s*180,00/)).toBeInTheDocument();
            expect(screen.getByText(/R\$\s*6\.480,00/)).toBeInTheDocument();
        });
    });
});
