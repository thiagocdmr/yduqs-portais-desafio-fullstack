import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Home from '../../pages/Home';
import { useCourses } from '../../contexts/CourseContext';

// Mock do useCourses
vi.mock('../../contexts/CourseContext', async () => {
    const actual = await vi.importActual('../../contexts/CourseContext');
    return {
        ...actual,
        useCourses: vi.fn(),
    };
});

describe('Home', () => {
    beforeEach(() => {
        vi.mocked(useCourses).mockReturnValue({
            courses: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
        });
    });

    it('should render intro banner with correct title', () => {
        render(<Home />);
        
        expect(screen.getByText('Vamos começar, escolha as opções do seu curso')).toBeInTheDocument();
    });

    it('should render intro banner with correct subtitle', () => {
        render(<Home />);
        
        expect(screen.getByText('Use os filtros para saber o preço do seu curso e fazer sua inscrição.')).toBeInTheDocument();
    });

    it('should render course grid', () => {
        render(<Home />);
        
        // Verifica que o CourseGrid está renderizado (mostra "0 opções encontradas")
        expect(screen.getByText('0 opções encontradas')).toBeInTheDocument();
    });

    it('should render both intro banner and course grid', () => {
        render(<Home />);
        
        // Verifica que ambos os componentes estão presentes
        expect(screen.getByText('Vamos começar, escolha as opções do seu curso')).toBeInTheDocument();
        expect(screen.getByText('0 opções encontradas')).toBeInTheDocument();
    });
});
