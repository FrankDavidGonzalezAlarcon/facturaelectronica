<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Permite peticiones desde React
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
require 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $conn->prepare("INSERT INTO factura (id_factura, fecha, id_cliente) 
                           VALUES (:id_factura, :fecha, :id_cliente)");
    
    $stmt->bindParam(':id_factura', $data['id_factura']);
    $stmt->bindParam(':fecha', $data['fecha']);
    $stmt->bindParam(':id_cliente', $data['id_cliente']);
    
    $stmt->execute();
    
    $id_factura = $conn->lastInsertId();
    
    echo json_encode(["success" => true, "id_factura" => $id_factura]);
} catch(PDOException $e) {
    echo json_encode(["error" => "Error al guardar factura: " . $e->getMessage()]);
}
?>