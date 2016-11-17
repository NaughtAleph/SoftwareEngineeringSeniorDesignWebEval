<?php
	session_start();
	unset($_SESSION['admin']);
	unset($_SESSION['name']);
	header("Location: ../index.html");
?>
