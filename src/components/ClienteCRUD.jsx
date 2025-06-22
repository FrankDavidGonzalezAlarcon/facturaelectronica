import React, { useState, useEffect } from 'react';

const ClienteCRUD = () => {
  const API_BASE_URL = 'http://localhost/facturaelectronica/src/api';
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    id_cliente: '',
    nombre: '',
    telefono: '',
    centrocomercial: '',
    local: '',
    fecha_venta: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función mejorada para manejar fetch
  const fetchData = async (url, options = {}) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw new Error(error.message || 'Error de conexión');
    }
  };

  // Obtener clientes
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData(`${API_BASE_URL}/crud_api.php`);
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(`Error al cargar clientes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_BASE_URL}/crud_api.php`;
      const method = editingId ? 'PUT' : 'POST';
      
      await fetchData(url, {
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': method
        },
        body: JSON.stringify(formData)
      });
      
      await fetchClientes();
      resetForm();
    } catch (error) {
      setError(`Error al ${editingId ? 'actualizar' : 'crear'} cliente: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cliente
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await fetchData(`${API_BASE_URL}/crud_api.php`, {
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'DELETE'
        },
        body: JSON.stringify({ id_cliente: id })
      });
      
      await fetchClientes();
    } catch (error) {
      setError(`Error al eliminar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      id_cliente: '',
      nombre: '',
      telefono: '',
      centrocomercial: '',
      local: '',
      fecha_venta: ''
    });
    setEditingId(null);
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="crud-container">
      <h2>Gestión de Clientes</h2>
      
      {/* Mensajes de estado */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}
      
      {loading && <div className="loading-overlay">Procesando...</div>}
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Teléfono*</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Centro Comercial</label>
            <input
              type="text"
              name="centrocomercial"
              value={formData.centrocomercial}
              onChange={(e) => setFormData({...formData, centrocomercial: e.target.value})}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Local</label>
            <input
              type="text"
              name="local"
              value={formData.local}
              onChange={(e) => setFormData({...formData, local: e.target.value})}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Fecha de Venta</label>
            <input
              type="date"
              name="fecha_venta"
              value={formData.fecha_venta}
              onChange={(e) => setFormData({...formData, fecha_venta: e.target.value})}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {editingId ? 'Actualizar Cliente' : 'Agregar Cliente'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} disabled={loading} className="btn-secondary">
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
      
      {/* Tabla de clientes */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Centro Comercial</th>
              <th>Local</th>
              <th>Fecha Venta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map(cliente => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.centrocomercial}</td>
                  <td>{cliente.local}</td>
                  <td>{cliente.fecha_venta}</td>
                  <td className="actions">
                    <button 
                      onClick={() => {
                        setFormData({
                          id_cliente: cliente.id_cliente,
                          nombre: cliente.nombre,
                          telefono: cliente.telefono,
                          centrocomercial: cliente.centrocomercial,
                          local: cliente.local,
                          fecha_venta: cliente.fecha_venta
                        });
                        setEditingId(cliente.id_cliente);
                      }}
                      disabled={loading}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(cliente.id_cliente)}
                      disabled={loading}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  {loading ? 'Cargando clientes...' : 'No hay clientes registrados'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClienteCRUD;