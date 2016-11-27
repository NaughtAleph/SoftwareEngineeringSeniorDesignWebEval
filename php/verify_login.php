<?php
$uname = $_POST['uname'];
$pass = $_POST['pass'];
$cont = file_get_contents("secrets/login.json") or die("Unable to get login info");
$login = json_decode($cont, true);

/* Check if the username is invalid */
if (!array_key_exists($uname, $login['login'])) {
	session_start();
	$_SESSION['admin'] = "0";
	$_SESSION['name'] = '';
	header("Location: ../login.html");
	die;
}
$hash = $login['login'][$uname];

/* Check if the password is valid for the given username */
if (password_verify($pass, $hash)) {
	session_start();
	$_SESSION['admin'] = "1";
	$_SESSION['name'] = $uname;
	header("Location: ../admin.html");
} else {
	session_start();
	$_SESSION['admin'] = "0";
	$_SESSION['name'] = '';
	header("Location: ../login.html");
}
?>
