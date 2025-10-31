import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CourseProvider } from '../contexts/CourseContext';
import { DrawerProvider } from '../contexts/DrawerContext';
import { EnrollmentProvider } from '../contexts/EnrollmentContext';

interface AllTheProvidersProps {
    children: React.ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
    return (
        <BrowserRouter>
            <CourseProvider>
                <EnrollmentProvider>
                    <DrawerProvider>
                        {children}
                    </DrawerProvider>
                </EnrollmentProvider>
            </CourseProvider>
        </BrowserRouter>
    );
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
