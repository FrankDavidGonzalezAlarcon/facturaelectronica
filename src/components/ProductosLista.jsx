import React from 'react';

const ProductosLista = ({ productos, handleChange, agregarProducto, eliminarProducto }) => {
  return (
    <div className="productos-lista">
      <h2>Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="descripcion"
                  value={producto.descripcion}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  name="cantidad"
                  min="0"
                  step="1"
                  value={producto.cantidad}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="precio_unit"
                  min="0"
                  step="0.01"
                  value={producto.precio_unit}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td>{producto.total.toFixed(2)}</td>
              <td>
                {productos.length > 1 && (
                  <button type="button" onClick={() => eliminarProducto(index)}>
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={agregarProducto}>
        Agregar Producto
      </button>
    </div>
  );
};

export default ProductosLista;