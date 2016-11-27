<?php
session_start();

/* Always check that the SESSION has the key 'admin' */
if (!array_key_exists('admin',$_SESSION)) {
        header("Location: ../login.html");
}

/* Always check that the caller is logged in */
if($_SESSION['admin'] == 1) {
	/* Check that the keys file exist */
	if (!file_exists('secrets/'.date("Y").'/keys.csv'))
		die("No keys file exists");
	header("Content-Type: application/octet-stream");
	header("Content-Transfer-Encoding: Binary");
	header("Content-disposition: attachment; filename=\"secrets/".date("Y")."/keys.csv\"");
	readfile('secrets/'.date("Y").'/keys.csv');
} else {
	die("die");
}
?>
