<?php
/*
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}
require __DIR__ . '/../vendor/autoload.php';
session_start();
// Instantiate the app
$settings = require __DIR__ . '/../src/settings.php';
$app = new \Slim\App($settings);
// Set up dependencies
require __DIR__ . '/../src/dependencies.php';
// Register middleware
require __DIR__ . '/../src/middleware.php';
// Register routes
require __DIR__ . '/../src/routes.php';
// Run app
$app->run();
*/
header("Content-Type: text/html;charset=utf-8");
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
require '../vendor/autoload.php';
// Configuració
$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;
$app = new \Slim\App(["settings" => $config]);
// /usuari/login (POST) retorna, donats userId i password, el nom, cognoms i rol del PRA
$app->post('/usuari/login', function (Request $request, Response $response){
	try{
		$allPostPutParams = $request->getParsedBody();
		$user = $allPostPutParams['nom'];
		$password = $allPostPutParams['pass'];
		include ("connexio.php"); // Include the file with the connection functions to the DB
	
		$bd = connectarBD();
		$sqlUserName = "SELECT idPRA,Nom,Cognoms,Rol FROM pra WHERE idPRA = '$user' and idPRA = '$password'"; // CHANGE!!! quan el password sigui el definitiu
		$comprobaUser = mysqli_query ($bd, $sqlUserName);
		$usuari = mysqli_fetch_object($comprobaUser);
	
		// Preparació dades UTF8 per generar jSON
		$NomUTF8 = utf8_encode($usuari->Nom);
		$CognomsUTF8 = utf8_encode($usuari->Cognoms);
		$retorn = array("nom" => $NomUTF8, "cognoms" => $CognomsUTF8, "rol" => $usuari->Rol);
		$response = $response->withJson($retorn, 200); // OK
		return($response);
	  	} 
	  	catch (Exception $e) {
    	// Assign the error message and use it to handle any customer messages or logging 
    		$error = $e->getMessage();
  		}
});

// /tipusDePesaTots (POST) retorna tots els tipus de peça introduïts al sistema
$app->post('/tipusDePesaTots', function (Request $request, Response $response){
	try{
		include ("connexio.php"); // Include the file with the connection functions to the DB
	
		$bd = connectarBD();
		$sqlTipusPesa = "SELECT idTipus, idCategoria FROM tipuspesa";
		$tipusDePesaTots = mysqli_query ($bd, $sqlTipusPesa);
		$tipus = mysqli_fetch_all ($tipusDePesaTots, MYSQLI_ASSOC);
		$registres = count($tipus);
		for ($i=0; $i<$registres; $i++){
			$retorn[$i] = $tipus[$i];
		}
		$response = $response->withJson($retorn, 200); // OK
		return($response);
	  	} 
	  	catch (Exception $e) {
    	// Assign the error message and use it to handle any customer messages or logging 
    		$error = $e->getMessage();
  		}
});

//usuari/llistatPeces (POST) retorna, donat userId i any, els idPesa de les 10 peces d'aquell PRA en l'any indicat
$app->post('/usuari/llistatPeces', function (Request $request, Response $response){
	try{
		$allPostPutParams = $request->getParsedBody();
		$user = $allPostPutParams['nom'];
		$any = $allPostPutParams['any'];
		include ("connexio.php"); // Crida al fitxer de la connexió
	
		$bd = connectarBD();
		//$retorn = array();
		for ($year = $any-1; $year<=$any+1;$year++){ //CHANGE to a single query!
			$sqlItemsList = "SELECT idPesa1,idPesa2,idPesa3,idPesa4,idPesa5,idPesa6,idPesa7,idPesa8,idPesa9,idPesa10 FROM obj_any_pra WHERE idPRA = '$user' and any = '$year'";
			$queryllistatPeces = mysqli_query ($bd, $sqlItemsList);
			$llistatPeces = mysqli_fetch_object($queryllistatPeces);
			for ($i=1; $i<=10; $i++){
				$pesaActual = "idPesa".$i;
				$indexPesaActual = $pesaActual."any".$year;
				$pesa = $llistatPeces->$pesaActual;
				$sqlItemsList2 = "SELECT etiqueta, idTipus FROM pesa WHERE idPesa = '$pesa'";
				$queryEtiqPesa = mysqli_query ($bd, $sqlItemsList2);
				$etiqPesa = mysqli_fetch_object($queryEtiqPesa);
				$etiqPesaUTF8 = utf8_encode($etiqPesa->etiqueta);
				$tipusPesa = $etiqPesa->idTipus;
				$dadesPesa = array ("etiqueta" => $etiqPesaUTF8, "tipus" => $tipusPesa);
				$retorn[$indexPesaActual] = $dadesPesa;
			}
		}
		$response = $response->withJson($retorn, 200); // OK
		return($response);
	  	} 
	  	catch (Exception $e) {
    	// Assign the error message and use it to handle any customer messages or logging 
    		$error = $e->getMessage();
  		}
});
//usuari/Peça (POST) retorna, donat userId i any, la peça clicada d'aquell PRA en l'any indicat
$app->post('/usuari/pesa', function (Request $request, Response $response){
	try{
		$allPostPutParams = $request->getParsedBody();
		$user = $allPostPutParams['nom'];
		$any = $allPostPutParams['any'];
		$pos = $allPostPutParams['posicio'];
		include ("connexio.php"); // Crida al fitxer de la connexió
		$bd = connectarBD();
		$columna = "idPesa". $pos; // Vull el codi de la idPesaX
		$sqlItem = "SELECT * FROM obj_any_pra WHERE idPRA = '$user' and any = '$any'";
		$queryPecesAnyPRA = mysqli_query ($bd, $sqlItem);
		$PecesAnyPRA = mysqli_fetch_object($queryPecesAnyPRA);
		
		$id = $PecesAnyPRA->$columna; // Aquest és el codi (únic) de la peça
		$sqlItem2 = "SELECT * FROM pesa WHERE idPesa = '$id'";
		$queryPesa = mysqli_query ($bd, $sqlItem2);
		$Pesa = mysqli_fetch_object($queryPesa);
		
		$id = $Pesa->idPesa;
		$etiqPesaUTF8 = utf8_encode($Pesa->etiqueta);
		$tipusPesaUTF8 = utf8_encode($Pesa->idTipus);
		
			$sqlItem3 = "SELECT explicacio FROM tipuspesa WHERE idTipus = '$tipusPesaUTF8'";
			$queryTipusConcat = mysqli_query ($bd, $sqlItem3);
			$tipusConcat = mysqli_fetch_object($queryTipusConcat);
	
		$tipusConcatUTF8 = utf8_encode($tipusConcat->explicacio);
		$aplicatPesaUTF8 = utf8_encode($Pesa->aplicat);
		$comprPesaUTF8 = utf8_encode($Pesa->compromis);
		$acompPesaUTF8 = utf8_encode($Pesa->acompliment);
		$validcPesaUTF8 = utf8_encode($Pesa->validacio);
		$validtPesaUTF8 = utf8_encode($Pesa->validat);
		$comenPesaUTF8 = utf8_encode($Pesa->comentaris);
		$dadesPesa = array ("id" => $id,"etiqueta" => $etiqPesaUTF8, "tipus" => $tipusPesaUTF8, "tipusConcat" => $tipusConcatUTF8, "aplicat" => $aplicatPesaUTF8, "compromis" => $comprPesaUTF8, "acompliment" => $acompPesaUTF8, "validacio" => $validcPesaUTF8, "validat" => $validtPesaUTF8, "comentaris" => $comenPesaUTF8);		
		$retorn = $dadesPesa;
		$response = $response->withJson($retorn, 200);
		return($response);
	  	} 
	  	catch (Exception $e) {
    	// Assign the error message and use it to handle any customer messages or logging 
    		$error = $e->getMessage();
  		}
});
//usuari/Peça (POST) retorna, donat userId i any, la peça clicada d'aquell PRA en l'any indicat
$app->post('/usuari/altaPesa', function (Request $request, Response $response){
	try{
		$allPostPutParams = $request->getParsedBody();
		$user = $allPostPutParams['user'];
		$year = $allPostPutParams['any'];
		$position = $allPostPutParams['posicio'];
		$etiqueta = $allPostPutParams['etiqueta'];
		$tipusP = $allPostPutParams['tipusP'];
		$aplicat = $allPostPutParams['aplicat'];
		$compromis = $allPostPutParams['compromis'];
		$acompliment = $allPostPutParams['acompliment'];
//		$validacio = $allPostPutParams['validacio'];
//		$validat = $allPostPutParams['validat'];
		$comentaris = $allPostPutParams['comentaris'];
		include ("connexio.php"); 
		$bd = connectarBD();
		
		// Tot això s'hauria de fer de manera íntegra. Si no es completa, s'hauria de fer un rollback

		//INSERT NEW PIECE IN pesa TABLE
		$sqlItem = "INSERT INTO pesa (idTipus, etiqueta, aplicat, compromis, acompliment, validacio, validat, comentaris, idPesa_modificada) VALUES ('$tipusP', '$etiqueta', '$aplicat', '$compromis', '$acompliment', 'PRA' , '0' , '$comentaris', NULL);";
		$queryAltaPesa = mysqli_query ($bd, $sqlItem);
		$idPesaNova = mysqli_insert_id($bd);
		//INSERT REFERENCE TO THE NEW pesa IN obj_any_pra TABLE
		if ($queryAltaPesa) {
			// Check if it is the first user's piece for that year
			$sqlYearExists = "SELECT * FROM obj_any_pra WHERE idPRA = '$user' AND any = '$year'";
			$queryYearExists = mysqli_query ($bd, $sqlYearExists);
			$YearExists = mysqli_fetch_object($queryYearExists);
			$idPosNova = "idPesa" . $position;
			// If it is, create a new register for the year and insert the piece reference
			if (mysqli_num_rows($queryYearExists) == 0) {
				$sqlItem2 = "INSERT INTO obj_any_pra (idPRA, any, ".$idPosNova.") VALUES ('$user', '$year', ".$idPesaNova.");";
				$queryAltaPesa2 = mysqli_query ($bd, $sqlItem2);
			}
			// If not, modify the existing year register to include the piece reference
			else{
				$sqlItem2 = "UPDATE obj_any_pra SET ".$idPosNova."= ".$idPesaNova." WHERE idPRA='$user' AND any='$year';";
				$queryAltaPesa2 = mysqli_query ($bd, $sqlItem2);
			}						
		}	
		$retorn = array("retorn" => $queryAltaPesa2);
		$response = $response->withJson($retorn, 200);
		return($response);
	  	} 
	  	catch (Exception $e) {
    	// Assign the error message and use it to handle any customer messages or logging 
    		$error = $e->getMessage();
  		}
});
$app->post('/usuari/modificaPesa', function (Request $request, Response $response){
	try{
		$allPostPutParams = $request->getParsedBody();
		$idPesa = $allPostPutParams['idPesa'];
		$etiqueta = $allPostPutParams['etiqueta'];
		$tipusP = $allPostPutParams['tipusP'];
		$aplicat = $allPostPutParams['aplicat'];
		$compromis = $allPostPutParams['compromis'];
		$acompliment = $allPostPutParams['acompliment'];
		$validacio = $allPostPutParams['validacio'];
		$validat = $allPostPutParams['validat'];
		$comentaris = $allPostPutParams['comentaris'];
		include ("connexio.php"); // Crida al fitxer de la connexió
		$bd = connectarBD();
		$sqlItemA = "SELECT * FROM pesa WHERE idPesa = '$idPesa'";
		$queryPesaA = mysqli_query ($bd, $sqlItemA);
		$PesaA = mysqli_fetch_object($queryPesaA);
		
		
		// FER UN INSERT AMB id NOU (AUTO) I AMB NºPEÇA ANTIGA A id_pesaModificada
		
		
		$response = $response->withJson($retorn, 200);
		return($response);
	  	} 
	  	catch (Exception $e) {
    	// Assign the error message and use it to handle any customer messages or logging 
    		$error = $e->getMessage();
  		}
});
$app->run();
?>