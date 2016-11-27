<?php
session_start();

/* Always check that the SESSION has the key 'admin' */
if (!array_key_exists('admin',$_SESSION)) {
	header("Location: ../login.html");
}

/* Always check that the caller is an admin */
if($_SESSION['admin'] == 1) {
	if (!array_key_exists("data",$_POST))
		die("die");
	$data = $_POST["data"];
	/* Too lazy to make sure the data is 100% perfect.		*/
	/* But Shane won't want to mess up his own system, right?	*/
	file_put_contents("secrets/".date("Y")."/presentations.json", $data);
} else {
	die("die");
}
?>
