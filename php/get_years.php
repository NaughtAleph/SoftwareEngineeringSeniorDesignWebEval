<?php
session_start();

/* Always check that the SESSION has the key 'admin' */
if (!array_key_exists('admin',$_SESSION)) {
	header("Location: ../login.html");
}

/* Always check that the caller is an admin */
if($_SESSION['admin'] == 1) {
	$years = scandir("scores");

	/* remove the first two elements from the $years array (. and ..) */
	array_shift($years);
	array_shift($years);
	echo json_encode($years);
}
?>
