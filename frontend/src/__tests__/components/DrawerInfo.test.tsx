import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DrawerInfo from '../../components/DrawerInfo';

describe('DrawerInfo', () => {
    const mockProps = {
        title: 'Test Title',
        description: 'Test Description',
    };

    it('should render title', () => {
        render(<DrawerInfo {...mockProps} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should start collapsed', () => {
        render(<DrawerInfo {...mockProps} />);
        expect(screen.queryByText('Test Description')).not.toBeVisible();
    });

    it('should expand when clicked', async () => {
        const user = userEvent.setup();
        render(<DrawerInfo {...mockProps} />);

        const container = screen.getByText('Test Title').closest('div')?.parentElement;
        if (container) {
            await user.click(container);
        }

        expect(screen.getByText('Test Description')).toBeVisible();
    });

    it('should show Add icon when collapsed', () => {
        const { container } = render(<DrawerInfo {...mockProps} />);
        const addIcon = container.querySelector('svg[data-testid="AddIcon"]');
        expect(addIcon).toBeInTheDocument();
    });

    it('should show Remove icon when expanded', async () => {
        const user = userEvent.setup();
        const { container } = render(<DrawerInfo {...mockProps} />);

        const box = screen.getByText('Test Title').closest('div')?.parentElement;
        if (box) {
            await user.click(box);
        }

        const removeIcon = container.querySelector('svg[data-testid="RemoveIcon"]');
        expect(removeIcon).toBeInTheDocument();
    });
});
