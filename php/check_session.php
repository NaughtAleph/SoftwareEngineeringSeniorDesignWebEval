<?php
session_start();
if($_SESSION['login'] == 1) {
	echo "yes";
}
else if ($_SESSION['login'] == 0) {
	echo "no";
}
else {
	echo "new";
}
?>
