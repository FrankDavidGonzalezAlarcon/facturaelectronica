import React from 'react';

const ClienteInfo = ({ cliente, handleChange }) => {
  return (
    <div className="cliente-info">
      <h2>Datos del Cliente</h2>
      <div className="form-group">
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={cliente.nombre}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Centro Comercial:
          <input
            type="text"
            name="centrocomercial"
            value={cliente.centrocomercial}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Local:
          <input
            type="text"
            name="local"
            value={cliente.local}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Fecha de Venta:
          <input
            type="date"
            name="fecha_venta"
            value={cliente.fecha_venta}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ClienteInfo;