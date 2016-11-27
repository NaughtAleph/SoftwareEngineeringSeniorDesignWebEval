<?php
session_start();

/* Always check that the SESSION has the key 'admin' */
if (!array_key_exists('admin', $_SESSION)) {
        header("Location: ../login.html");
}

/* Always check that the caller is logged in */
if($_SESSION['admin'] == 1) {
	/* Make sure that the GET has the key 'year' */
	if (!array_key_exists('year', $_SESSION)) {
		header("Location: ../admin.html");
	}
	$year = $_GET["year"];

	/* Make sure that the year is a number */
	if (!ctype_digit($year)) {
		header("Location: ../admin.html");
		die;
	}
	header("Location: ../search.html?year=".$year);
}
?>
