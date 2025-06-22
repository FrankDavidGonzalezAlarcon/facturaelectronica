import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Factura from '../Factura';

describe('FacturaGenerator Component', () => {
  test('renderiza el título principal correctamente', () => {
    render(<Factura />);
    expect(screen.getByText('Factura Electrónica')).toBeInTheDocument();
  });

  test('muestra campos de cliente obligatorios', () => {
    render(<Factura />);
    expect(screen.getByLabelText('Nombre:')).toBeRequired();
    expect(screen.getByLabelText('N° Factura: *')).toBeRequired();
  });

  test('permite ingresar datos de cliente', () => {
    render(<Factura />);
    const nombreInput = screen.getByLabelText('Nombre:');
    fireEvent.change(nombreInput, { target: { value: 'Juan Pérez' } });
    expect(nombreInput.value).toBe('Juan Pérez');
  });

  test('agrega una nueva fila de producto', () => {
    render(<Factura />);
    const initialRows = screen.getAllByRole('row').length;
    const addButton = screen.getByText('Agregar Producto');
    fireEvent.click(addButton);
    expect(screen.getAllByRole('row').length).toBe(initialRows + 1);
  });

  test('calcula subtotal al modificar cantidad y precio', () => {
    render(<Factura />);
    const cantidadInput = screen.getAllByRole('spinbutton')[0];
    const precioInput = screen.getAllByRole('spinbutton')[1];
    
    fireEvent.change(cantidadInput, { target: { value: '2' } });
    fireEvent.change(precioInput, { target: { value: '10' } });
    
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });
});