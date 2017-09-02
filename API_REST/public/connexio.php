<?php

header("Content-Type: text/html;charset=utf-8");

function connectarBD()
{
    $dbhost = "localhost";
    $dbuser = "legobd";
    $dbpass = "hwrcmwo41";
    $dbname = "lego";

	$dbConnexio = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

	//$dbConnexiom->set_charset("utf8")
	//mysql_query("SET NAMES 'utf8'");
	//$acentos = $dbname->query("SET NAMES 'utf8'"); // variables correctes??
	
    return $dbConnexio; 
}
?>