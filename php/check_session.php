<?php
session_start();
if (!array_key_exists('login',$_SESSION)) {
	die("new");
}
if($_SESSION['login'] == 1) {
	echo "yes";
}
else if ($_SESSION['login'] == 0) {
	echo "no";
}
?>
