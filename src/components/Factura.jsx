import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ClienteInfo from './ClienteInfo';
import ProductosLista from './ProductosLista';
import Totales from './Totales';
import './styles/factura.css';
import logoFactura from './assets/logo-factura.png';

// Configuración para XAMPP (ajusta el nombre de tu proyecto)
// Usa ESTA configuración:
const API_URL = 'http://localhost/facturaelectronica/src/api';

const Factura = () => {
  // Estado inicial con datos de ejemplo
  const [factura, setFactura] = useState({
    id_factura: '',
    fecha: new Date().toISOString().split('T')[0],
    id_cliente: '',
  });

  const [cliente, setCliente] = useState({
    id_cliente: '',
    nombre: '',
    telefono: '',
    centrocomercial: '',
    local: '',
    fecha_venta: '',
  });

  const [productos, setProductos] = useState([
    {
      id_producto: '',
      descripcion: '',
      cantidad: 0,
      precio_unit: 0,
      total: 0,
      id_factura: '',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const facturaRef = useRef();

  // Calcular totales
  const subtotal = productos.reduce((sum, producto) => sum + producto.total, 0);
  const iva = subtotal * 0.16; // Suponiendo 16% de IVA
  const total = subtotal + iva;

  // Handler para cambios en los inputs
  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleProductoChange = (index, e) => {
    const { name, value } = e.target;
    const newProductos = [...productos];
    newProductos[index] = {
      ...newProductos[index],
      [name]: name === 'descripcion' ? value : parseFloat(value) || 0,
    };
    
    if (name === 'cantidad' || name === 'precio_unit') {
      newProductos[index].total = newProductos[index].cantidad * newProductos[index].precio_unit;
    }
    
    setProductos(newProductos);
  };

  const agregarProducto = () => {
    setProductos([
      ...productos,
      {
        id_producto: '',
        descripcion: '',
        cantidad: 0,
        precio_unit: 0,
        total: 0,
        id_factura: '',
      },
    ]);
  };

  const eliminarProducto = (index) => {
    const newProductos = productos.filter((_, i) => i !== index);
    setProductos(newProductos);
  };

  // Función para exportar a PDF
  const exportarAPDF = () => {
    setLoading(true);
    const input = facturaRef.current;
    
    html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#edf5ffe0'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (imgProps.height * contentWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
      pdf.save(`factura_${factura.id_factura || 'generada'}.pdf`);
      setLoading(false);
    }).catch(err => {
      console.error('Error al generar PDF:', err);
      setError('Error al generar el PDF');
      setLoading(false);
    });
  };

  // Función mejorada para guardar en la base de datos
  const handleGuardar = async () => {
    if (!factura.id_factura || !cliente.nombre) {
      setError('Por favor complete el número de factura y nombre del cliente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Guardar cliente
      const clienteResponse = await fetch(`${API_URL}/guardar_cliente.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(cliente)
      });
      
      if (!clienteResponse.ok) {
        const errorText = await clienteResponse.text();
        throw new Error(`Error al guardar cliente: ${errorText}`);
      }
      
      const clienteData = await clienteResponse.json();
      
      if (!clienteData.success) {
        throw new Error(clienteData.error || 'Error al guardar cliente');
      }

      // 2. Guardar factura
      const facturaData = {
        ...factura,
        id_cliente: clienteData.id_cliente
      };
      
      const facturaResponse = await fetch(`${API_URL}/guardar_factura.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(facturaData)
      });
      
      if (!facturaResponse.ok) {
        const errorText = await facturaResponse.text();
        throw new Error(`Error al guardar factura: ${errorText}`);
      }
      
      const facturaResult = await facturaResponse.json();
      
      if (!facturaResult.success) {
        throw new Error(facturaResult.error || 'Error al guardar factura');
      }

      // 3. Guardar productos
      const productosPromises = productos.map(producto => {
        const productoData = {
          ...producto,
          id_factura: factura.id_factura || facturaResult.id_factura
        };
        
        return fetch(`${API_URL}/guardar_producto.php`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(productoData)
        });
      });

      const productosResponses = await Promise.all(productosPromises);
      
      // Verificar cada respuesta
      for (const response of productosResponses) {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al guardar productos: ${errorText}`);
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Error al guardar productos');
        }
      }

      alert('Factura guardada correctamente en la base de datos');
    } catch (error) {
      console.error('Error al guardar:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="factura-container" ref={facturaRef}>
      <div className="titulo-con-logo">
        <img src={logoFactura} alt="Logo Facturación" className="logo-factura" />
        <h1>Factura Electrónica</h1>
      </div>
      
      <div className="factura-header">
        <div className="factura-info">
          <label>
            N° Factura: *
            <input 
              type="text" 
              name="id_factura" 
              value={factura.id_factura} 
              onChange={(e) => setFactura({...factura, id_factura: e.target.value})}
              required
            />
          </label>
          <label>
            Fecha:
            <input 
              type="date" 
              name="fecha" 
              value={factura.fecha} 
              onChange={(e) => setFactura({...factura, fecha: e.target.value})}
            />
          </label>
        </div>
      </div>

      <ClienteInfo cliente={cliente} handleChange={handleClienteChange} />

      <ProductosLista 
        productos={productos} 
        handleChange={handleProductoChange} 
        agregarProducto={agregarProducto} 
        eliminarProducto={eliminarProducto} 
      />

      <Totales subtotal={subtotal} iva={iva} total={total} />
      
      <div className="botones-accion">
        {error && <div className="error-message">{error}</div>}
        <button 
          className="btn-guardar" 
          onClick={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <span>Guardando...</span>
          ) : (
            <>
              <i className="fas fa-save"></i> Guardar Factura
            </>
          )}
        </button>
        <button 
          className="btn-pdf" 
          onClick={exportarAPDF}
          disabled={loading}
        >
          {loading ? (
            <span>Generando...</span>
          ) : (
            <>
              <i className="fas fa-file-pdf"></i> Exportar a PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Factura;