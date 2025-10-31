import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { CourseProvider, useCourses } from '../../contexts/CourseContext';
import { courseService } from '../../services/courseService';
import type { Course } from '../../types/course';

// Mock do courseService
vi.mock('../../services/courseService', () => ({
    courseService: {
        getAll: vi.fn(),
    },
}));

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

describe('CourseContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('CourseProvider', () => {
        it('should fetch courses on mount', async () => {
            vi.mocked(courseService.getAll).mockResolvedValue(mockCourses);

            const { result } = renderHook(() => useCourses(), {
                wrapper: CourseProvider,
            });

            // Inicialmente está carregando
            expect(result.current.loading).toBe(true);
            expect(result.current.courses).toEqual([]);
            expect(result.current.error).toBeNull();

            // Aguarda o carregamento
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Verifica que os cursos foram carregados
            expect(result.current.courses).toEqual(mockCourses);
            expect(result.current.error).toBeNull();
            expect(courseService.getAll).toHaveBeenCalledTimes(1);
        });

        it('should handle fetch error', async () => {
            const errorMessage = 'Erro ao buscar cursos';
            vi.mocked(courseService.getAll).mockRejectedValue(new Error(errorMessage));

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const { result } = renderHook(() => useCourses(), {
                wrapper: CourseProvider,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.courses).toEqual([]);
            expect(result.current.error).toBe(errorMessage);
            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });

        it('should refetch courses when refetch is called', async () => {
            vi.mocked(courseService.getAll).mockResolvedValue(mockCourses);

            const { result } = renderHook(() => useCourses(), {
                wrapper: CourseProvider,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Limpa os mocks
            vi.clearAllMocks();

            // Chama refetch
            const newCourses = [mockCourses[0]];
            vi.mocked(courseService.getAll).mockResolvedValue(newCourses);

            await result.current.refetch();

            await waitFor(() => {
                expect(result.current.courses).toEqual(newCourses);
            });

            expect(courseService.getAll).toHaveBeenCalledTimes(1);
        });

        it('should set loading state during refetch', async () => {
            vi.mocked(courseService.getAll).mockResolvedValue(mockCourses);

            const { result } = renderHook(() => useCourses(), {
                wrapper: CourseProvider,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Cria uma promise que podemos controlar
            let resolvePromise: (value: Course[]) => void;
            const promise = new Promise<Course[]>((resolve) => {
                resolvePromise = resolve;
            });

            vi.mocked(courseService.getAll).mockReturnValue(promise);

            // Chama refetch
            const refetchPromise = result.current.refetch();

            // Verifica que está carregando
            await waitFor(() => {
                expect(result.current.loading).toBe(true);
            });

            // Resolve a promise
            resolvePromise!(mockCourses);
            await refetchPromise;

            // Verifica que parou de carregar
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });

        it('should clear error on successful refetch', async () => {
            // Primeiro fetch com erro
            vi.mocked(courseService.getAll).mockRejectedValue(new Error('Erro'));
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const { result } = renderHook(() => useCourses(), {
                wrapper: CourseProvider,
            });

            await waitFor(() => {
                expect(result.current.error).toBeTruthy();
            });

            // Refetch com sucesso
            vi.mocked(courseService.getAll).mockResolvedValue(mockCourses);
            await result.current.refetch();

            await waitFor(() => {
                expect(result.current.error).toBeNull();
                expect(result.current.courses).toEqual(mockCourses);
            });

            consoleErrorSpy.mockRestore();
        });
    });

    describe('useCourses', () => {
        it('should throw error when used outside provider', () => {
            expect(() => {
                renderHook(() => useCourses());
            }).toThrow('useCourses deve ser usado dentro de um CourseProvider');
        });
    });
});
