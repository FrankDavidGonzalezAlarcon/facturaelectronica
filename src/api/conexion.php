<?php
header("Access-Control-Allow-Origin: http://localhost:3001"); // Permite peticiones desde React
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "facturaelectronica.mysql.database.azure.com";
$username = "facturaelectronicaadmin";
$password = "L0qu1ll0";
$dbname = "facturaelectronica";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => "Conexión fallida: " . $e->getMessage()]);
    exit();
}
?>