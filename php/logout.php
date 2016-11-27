<?php
/* Unset the variables set when logged in, then redirect to index */
session_start();
unset($_SESSION['admin']);
unset($_SESSION['name']);
header("Location: ../index.html");
?>
