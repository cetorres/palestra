<?php
session_start();
date_default_timezone_set('America/Fortaleza');

// Conexão ao banco

$dbHost = "localhost"; 	 
$dbUser = "carloseu_pavalia";
$dbPass = "cepalestra2013";
$dbDatabase = "carloseu_palestraavaliacao";

/*
$dbHost = "localhost:8889";
$dbUser = "root"; 
$dbPass = "root";
$dbDatabase = "palestraavaliacao";
*/
$db = mysql_connect($dbHost, $dbUser, $dbPass) or die('Não foi possível conectar ao banco de dados.');
mysql_select_db($dbDatabase, $db) or die('Não foi possível selecionar o banco de dados.');
mysql_query('SET CHARACTER SET utf8');

// Testa ações
if (isset($_REQUEST["rating"]) && $_REQUEST["rating"] <> "" 
	&& isset($_REQUEST["tipo"]) && $_REQUEST["tipo"] <> ""
	&& isset($_REQUEST["local"]) && $_REQUEST["local"] <> ""
	) {
	$rating = $_REQUEST["rating"];
	$tipo = $_REQUEST["tipo"];
	$local = $_REQUEST["local"];
	
	// Se já existir nota para o usuário da sessão, somente faz update, senão insere
	if (ratingExiste($tipo, $local)) {
		$query = "UPDATE avaliacao SET ava_nota = '$rating' WHERE ava_tipo = '$tipo' AND ava_local = '$local' AND ava_usuario = '" . session_id() . "'";
		$records = mysql_query($query);
	}
	else {
		$query = "INSERT INTO avaliacao (ava_nota, ava_tipo, ava_local, ava_usuario, ava_data) VALUES ('$rating','$tipo','$local','" . session_id() . "','" . date('Y-m-d H:i:s') . "')";
		$records = mysql_query($query);		
	}
	
	if ($records) {
		header('Content-type: application/json');
		echo json_encode(getMedia($tipo));
	}		
}
else if (isset($_GET["tipo"]) && $_GET["tipo"] <> ""
		 && isset($_GET["local"]) && $_GET["local"] <> "") {
	$tipo = $_GET["tipo"];
	$local = $_GET["local"];
	header('Content-type: application/json');
	echo json_encode(getMedia($tipo, $local));
}

function ratingExiste($tipo, $local) {
	$query = "SELECT ava_id FROM avaliacao WHERE ava_tipo = '$tipo' AND ava_local = '$local' AND ava_usuario = '" . session_id() . "'";
	$result = mysql_query($query);
	if (mysql_num_rows($result) > 0)
		return true;
	return false;
}

function getMedia($tipo, $local) {
	$query = "SELECT ava_tipo as tipo, (sum(ava_nota)/count(*)) as media FROM avaliacao WHERE ava_tipo = '$tipo' AND ava_local = '$local'";
	$result = mysql_query($query);
	$list = array();
	while ($row = mysql_fetch_array($result)) {
		$list[] = array('tipo'=>$row['tipo'], 'media'=>$row['media']);
	}
	return $list;
}
?>