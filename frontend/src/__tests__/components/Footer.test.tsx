import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from '../../components/Footer';

const renderFooterWithRoute = (route: string) => {
    window.history.pushState({}, 'Test page', route);
    return render(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Footer />} />
                <Route path="/student-form" element={<Footer />} />
            </Routes>
        </BrowserRouter>
    );
};

describe('Footer', () => {
    it('should render contact information', () => {
        renderFooterWithRoute('/');
        expect(screen.getByText('0800 771 5055')).toBeInTheDocument();
        expect(screen.getByText('Precisa de ajuda?')).toBeInTheDocument();
    });

    it('should render phone and whatsapp icons', () => {
        renderFooterWithRoute('/');
        const phoneIcon = screen.getByAltText('Telefone');
        const whatsappIcon = screen.getByAltText('WhatsApp');
        expect(phoneIcon).toBeInTheDocument();
        expect(whatsappIcon).toBeInTheDocument();
    });

    describe('Home page', () => {
        it('should render logo on home page', () => {
            renderFooterWithRoute('/');
            const logo = screen.getByAltText('Logo Estácio');
            expect(logo).toBeInTheDocument();
        });
    });

    describe('Student Form page', () => {
        it('should not render logo on student form page', () => {
            renderFooterWithRoute('/student-form');
            const logo = screen.queryByAltText('Logo Estácio');
            expect(logo).not.toBeInTheDocument();
        });

        it('should render privacy policy link on student form page', () => {
            renderFooterWithRoute('/student-form');
            const privacyLink = screen.getByText('Política de privacidade');
            expect(privacyLink).toBeInTheDocument();
        });

        it('should render copyright text on student form page', () => {
            renderFooterWithRoute('/student-form');
            expect(screen.getByText(/Estácio Brasil - Todos os direitos reservados/i)).toBeInTheDocument();
        });
    });
});
