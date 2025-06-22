import React from 'react';

const Totales = ({ subtotal, iva, total }) => {
  return (
    <div className="totales">
      <h2>Totales</h2>
      <div className="total-row">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="total-row">
        <span>IVA (16%):</span>
        <span>${iva.toFixed(2)}</span>
      </div>
      <div className="total-row">
        <strong>Total:</strong>
        <strong>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default Totales;