import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Success from '../../pages/Success';
import { useEnrollment } from '../../contexts/EnrollmentContext';

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

describe('Success', () => {
    const mockClearEnrollment = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        
        vi.mocked(useEnrollment).mockReturnValue({
            selectedCourse: null,
            selectedInstallmentPlan: null,
            setSelectedCourse: vi.fn(),
            setSelectedInstallmentPlan: vi.fn(),
            clearEnrollment: mockClearEnrollment,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render success message', () => {
        render(<Success />);
        
        expect(screen.getByText('Matrícula realizada com sucesso!')).toBeInTheDocument();
        expect(screen.getByText('Sua matrícula foi processada com sucesso!')).toBeInTheDocument();
    });

    it('should render confirmation email message', () => {
        render(<Success />);
        
        expect(screen.getByText(/Em breve você receberá um e-mail de confirmação/i)).toBeInTheDocument();
    });

    it('should render spam warning', () => {
        render(<Success />);
        
        expect(screen.getByText(/Não se esqueça de verificar sua caixa de spam/i)).toBeInTheDocument();
    });

    it('should render success icon', () => {
        render(<Success />);
        
        expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('should render back to home button', () => {
        render(<Success />);
        
        expect(screen.getByRole('button', { name: /Voltar para a página inicial/i })).toBeInTheDocument();
    });

    it('should not clear enrollment before 5 seconds', () => {
        render(<Success />);
        
        // Avança 4 segundos
        vi.advanceTimersByTime(4000);
        
        expect(mockClearEnrollment).not.toHaveBeenCalled();
    });

    it('should cleanup timer on unmount', () => {
        const { unmount } = render(<Success />);
        
        unmount();
        
        // Avança 5 segundos após unmount
        vi.advanceTimersByTime(5000);
        
        // Não deve ter sido chamado
        expect(mockClearEnrollment).not.toHaveBeenCalled();
    });

    it('should render intro banner', () => {
        render(<Success />);
        
        expect(screen.getByText('Matrícula realizada com sucesso!')).toBeInTheDocument();
    });
});
