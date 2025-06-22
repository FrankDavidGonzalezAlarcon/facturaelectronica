<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With, X-HTTP-Method-Override");
header("Access-Control-Max-Age: 3600");

// Habilitar CORS para solicitudes preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/conexion.php';

// Obtener método real
$method = $_SERVER['REQUEST_METHOD'];
if (isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
    $method = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'];
}

$input = json_decode(file_get_contents("php://input"), true);

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    switch ($method) {
        case 'GET':
            $stmt = $conn->query("SELECT * FROM cliente");
            $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode($clientes);
            break;

        case 'POST':
        case 'PUT':
            $query = $method == 'POST' 
                ? "INSERT INTO cliente (nombre, telefono, centrocomercial, local, fecha_venta) VALUES (?, ?, ?, ?, ?)"
                : "UPDATE cliente SET nombre=?, telefono=?, centrocomercial=?, local=?, fecha_venta=? WHERE id_cliente=?";
            
            $stmt = $conn->prepare($query);
            $params = [
                $input['nombre'],
                $input['telefono'],
                $input['centrocomercial'],
                $input['local'],
                $input['fecha_venta']
            ];
            
            if ($method == 'PUT') {
                $params[] = $input['id_cliente'];
            }
            
            if ($stmt->execute($params)) {
                http_response_code($method == 'POST' ? 201 : 200);
                echo json_encode(["message" => "Operación exitosa", "id" => $method == 'POST' ? $conn->lastInsertId() : $input['id_cliente']]);
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Error en la operación"]);
            }
            break;

        case 'DELETE':
            $stmt = $conn->prepare("DELETE FROM cliente WHERE id_cliente = ?");
            if ($stmt->execute([$input['id_cliente']])) {
                http_response_code(200);
                echo json_encode(["message" => "Cliente eliminado"]);
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Error al eliminar"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["message" => "Método no permitido"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Error en el servidor",
        "error" => $e->getMessage()
    ]);
}
?>