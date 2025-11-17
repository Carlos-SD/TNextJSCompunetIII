import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../ConfirmModal';

describe('ConfirmModal Component', () => {
  const defaultProps = {
    title: 'Confirm Action',
    message: 'Are you sure?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with title and message', () => {
    render(<ConfirmModal {...defaultProps} />);
    
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    
    const confirmButton = screen.getByText('Aceptar');
    fireEvent.click(confirmButton);
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should display custom button text', () => {
    render(
      <ConfirmModal
        {...defaultProps}
        confirmText="Yes, delete it"
        cancelText="No, keep it"
      />
    );
    
    expect(screen.getByText('Yes, delete it')).toBeInTheDocument();
    expect(screen.getByText('No, keep it')).toBeInTheDocument();
  });

  it('should apply danger styling when type is danger', () => {
    render(<ConfirmModal {...defaultProps} type="danger" />);
    
    const confirmButton = screen.getByText('Aceptar');
    expect(confirmButton).toHaveClass('bg-red-600');
  });
});

