<?php
/* Make sure that the POST has the key 'key' */
if (!array_key_exists('key', $_POST)) {
        header("Location: ../index.html");
}

$key = $_POST['key'];
$key = htmlspecialchars($key);
$year = date("Y");
$string = file_get_contents("secrets/".$year."/sessionkeys.json") or die("Unable to get session keys.");
$json = json_decode($string, true);

/* If the key is in one of this years session keys, continue */
if(in_array($key, $json['sessionkeys'])) {
	session_start();
	$_SESSION['login'] = "1";
	$_SESSION['key'] = $key;
	header("Location: ../evaluate.html");
}
/* Otherwise this was an invalid login */
else {
	session_start();
	$_SESSION['login'] = "0";
	$_SESSION['key'] = "";
	header("Location: ../index.html");
}
?>
