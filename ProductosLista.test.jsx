import React from 'react';
import { render } from '@testing-library/react';
import ProductosLista from '../ProductosLista';

test('muestra la tabla de productos', () => {
  const { getByText } = render(<ProductosLista productos={[]} />);
  expect(getByText('Productos')).toBeInTheDocument();
});