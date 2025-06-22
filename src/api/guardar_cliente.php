<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Permite peticiones desde React
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
require 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $conn->prepare("INSERT INTO cliente (nombre, telefono, centrocomercial, local, fecha_venta) 
                           VALUES (:nombre, :telefono, :centrocomercial, :local, :fecha_venta)");
    
    $stmt->bindParam(':nombre', $data['nombre']);
    $stmt->bindParam(':telefono', $data['telefono']);
    $stmt->bindParam(':centrocomercial', $data['centrocomercial']);
    $stmt->bindParam(':local', $data['local']);
    $stmt->bindParam(':fecha_venta', $data['fecha_venta']);
    
    $stmt->execute();
    
    $id_cliente = $conn->lastInsertId();
    
    echo json_encode(["success" => true, "id_cliente" => $id_cliente]);
} catch(PDOException $e) {
    echo json_encode(["error" => "Error al guardar cliente: " . $e->getMessage()]);
}
?>