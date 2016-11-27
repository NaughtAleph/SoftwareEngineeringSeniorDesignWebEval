<?php
session_start();

/* Possible things that could happen */

/* The SESSION variable was not initialized */
if (!array_key_exists('login',$_SESSION)) {
	die("new");
}

/* The person is a logged in judge */
if($_SESSION['login'] == 1) {
	echo "yes";
}

/* The person failed to log in as a judge */
else if ($_SESSION['login'] == 0) {
	echo "no";
}
?>
