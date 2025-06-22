import React from 'react';
import { render } from '@testing-library/react';
import Totales from '../Totales';

test('muestra los totales correctamente', () => {
  const { getByText } = render(<Totales subtotal={100} iva={16} total={116} />);
  expect(getByText('$116.00')).toBeInTheDocument();
});