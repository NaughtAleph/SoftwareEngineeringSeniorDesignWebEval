<?php
session_start();

/* Possible things that could happen */

/* The SESSION variable was not initialized (or the admin logged out) */
if (!array_key_exists('admin',$_SESSION)) {
	die("new");
}

/* The person is an admin */
if($_SESSION['admin'] == 1) {
	echo "yes";
}

/* The person failed to login as an admin */
else if ($_SESSION['admin'] == 0) {
	echo "no";
}
?>
