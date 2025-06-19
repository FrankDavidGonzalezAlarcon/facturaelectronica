import React from 'react';
import { render, screen } from '@testing-library/react';
import ClienteInfo from '../ClienteInfo';

describe('ClienteInfo Component', () => {
  const mockCliente = {
    nombre: '',
    telefono: '',
    centrocomercial: '',
    local: '',
    fecha_venta: ''
  };

  test('renderiza los campos del cliente', () => {
    render(<ClienteInfo cliente={mockCliente} handleChange={() => {}} />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
  });
});