<?php
session_start();

/* Always check that the SESSION has the key 'login' */
if (!array_key_exists("login", $_SESSION)) {
	header("Location: ../index.html");
}

/* Always check that the GET has the key 'name' */
if (!array_key_exists("name", $_GET)) {
	die("die");
}

/* Always check that the caller is logged in */
if ($_SESSION["login"] == 1) {
	$year = date("Y");

	/* If the file exists, return yes */
	if (file_exists("scores/".$year."/".$_SESSION["key"]."_".$_GET["name"].".json"))
		die("yes");
	die("no");
} else {
	die("die");
}
?>
