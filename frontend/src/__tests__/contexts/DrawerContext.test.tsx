import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { DrawerProvider, useDrawer } from '../../contexts/DrawerContext';
import type { Course } from '../../types/course';

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

describe('DrawerContext', () => {
    describe('DrawerProvider', () => {
        it('should start with drawer closed', () => {
            const { result } = renderHook(() => useDrawer(), {
                wrapper: DrawerProvider,
            });

            expect(result.current.isOpen).toBe(false);
            expect(result.current.selectedCourse).toBeNull();
        });

        it('should open drawer with selected course', () => {
            const { result } = renderHook(() => useDrawer(), {
                wrapper: DrawerProvider,
            });

            act(() => {
                result.current.openDrawer(mockCourse);
            });

            expect(result.current.isOpen).toBe(true);
            expect(result.current.selectedCourse).toEqual(mockCourse);
        });

        it('should close drawer', () => {
            const { result } = renderHook(() => useDrawer(), {
                wrapper: DrawerProvider,
            });

            // Abre o drawer
            act(() => {
                result.current.openDrawer(mockCourse);
            });

            expect(result.current.isOpen).toBe(true);

            // Fecha o drawer
            act(() => {
                result.current.closeDrawer();
            });

            expect(result.current.isOpen).toBe(false);
        });

        it('should clear selected course after closing (with delay)', async () => {
            vi.useFakeTimers();

            const { result } = renderHook(() => useDrawer(), {
                wrapper: DrawerProvider,
            });

            // Abre o drawer
            act(() => {
                result.current.openDrawer(mockCourse);
            });

            expect(result.current.selectedCourse).toEqual(mockCourse);

            // Fecha o drawer
            act(() => {
                result.current.closeDrawer();
            });

            // Ainda tem o curso selecionado
            expect(result.current.selectedCourse).toEqual(mockCourse);

            // Avança o timer 300ms
            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Agora o curso foi limpo
            expect(result.current.selectedCourse).toBeNull();

            vi.useRealTimers();
        });

        it('should allow opening drawer with different courses', () => {
            const { result } = renderHook(() => useDrawer(), {
                wrapper: DrawerProvider,
            });

            const course2: Course = {
                ...mockCourse,
                id: 2,
                modality: 'Graduação EAD',
            };

            // Abre com primeiro curso
            act(() => {
                result.current.openDrawer(mockCourse);
            });

            expect(result.current.selectedCourse?.id).toBe(1);

            // Abre com segundo curso
            act(() => {
                result.current.openDrawer(course2);
            });

            expect(result.current.selectedCourse?.id).toBe(2);
            expect(result.current.isOpen).toBe(true);
        });
    });

    describe('useDrawer', () => {
        it('should throw error when used outside provider', () => {
            expect(() => {
                renderHook(() => useDrawer());
            }).toThrow('useDrawer deve ser usado dentro de um DrawerProvider');
        });
    });
});
