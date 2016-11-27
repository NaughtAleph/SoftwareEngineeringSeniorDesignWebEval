<?php
session_start();

/* Always check that the SESSION has the key 'admin' */
if (!array_key_exists('admin',$_SESSION)) {
        header("Location: ../index.html");
}

/* Always check that the caller is logged in */
if($_SESSION['admin'] == 1) {

	$year = date("Y");

	/* Check that the year is in the folder */
	if (!in_array($year, scandir("secrets")))
		die("die");

	/* Get the session information */
	$presentations = json_decode(file_get_contents("secrets/".$year."/presentations.json"));
	$session_info = $presentations->sessioninfo;
	$keys = array_keys((array)$session_info);
	$ret = [];

	/* Get the number of files that start with each key and add that number to the return array */
	foreach ($session_info as $k=>$v) {
		$files = glob("scores/".$year."/".$k."*");
		$ret[$v->session] = count($files);
	}
	echo json_encode($ret);
} else {
	die("die");
}
?>
