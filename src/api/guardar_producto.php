<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Permite peticiones desde React
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
require 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $conn->prepare("INSERT INTO producto (descripcion, cantidad, precio_unit, total, id_factura) 
                           VALUES (:descripcion, :cantidad, :precio_unit, :total, :id_factura)");
    
    $stmt->bindParam(':descripcion', $data['descripcion']);
    $stmt->bindParam(':cantidad', $data['cantidad']);
    $stmt->bindParam(':precio_unit', $data['precio_unit']);
    $stmt->bindParam(':total', $data['total']);
    $stmt->bindParam(':id_factura', $data['id_factura']);
    
    $stmt->execute();
    
    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    echo json_encode(["error" => "Error al guardar producto: " . $e->getMessage()]);
}
?>