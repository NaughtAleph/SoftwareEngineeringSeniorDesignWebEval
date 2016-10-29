<?php
session_start();
if (!array_key_exists('admin',$_SESSION)) {
	die("new");
}
if($_SESSION['admin'] == 1) {
	echo "yes";
}
else if ($_SESSION['admin'] == 0) {
	echo "no";
}
?>
