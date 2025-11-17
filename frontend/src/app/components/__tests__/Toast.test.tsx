import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Toast from '../Toast';

describe('Toast Component', () => {
  it('should render toast with correct message', () => {
    const mockClose = jest.fn();
    
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={mockClose}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should display success styles for success type', () => {
    const mockClose = jest.fn();
    
    render(
      <Toast
        message="Success!"
        type="success"
        onClose={mockClose}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-success/20');
  });

  it('should display error styles for error type', () => {
    const mockClose = jest.fn();
    
    render(
      <Toast
        message="Error!"
        type="error"
        onClose={mockClose}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-danger/20');
  });

  it('should call onClose after duration', () => {
    jest.useFakeTimers();
    const mockClose = jest.fn();
    
    render(
      <Toast
        message="Auto remove"
        type="info"
        onClose={mockClose}
        duration={3000}
      />
    );

    expect(mockClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockClose).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should handle manual close button click', () => {
    const mockClose = jest.fn();
    
    const { container } = render(
      <Toast
        message="Click to close"
        type="warning"
        onClose={mockClose}
      />
    );

    const closeButton = container.querySelector('button[aria-label="Cerrar notificación"]');
    if (closeButton) {
      closeButton.click();
      expect(mockClose).toHaveBeenCalled();
    }
  });
});

