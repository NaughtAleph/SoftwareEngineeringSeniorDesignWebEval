<?php
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		$key = $_POST['key'];
		$key = htmlspecialchars($key);
		$string = file_get_contents(__DIR__ . "/secrets/sessionkeys.json") or die("Unable to get session keys.");
		$json = json_decode($string, true);
		if(in_array($key, $json['sessionkeys'])) {
			session_start();
			$_SESSION['login'] = "1";
			$_SESSION['key'] = $key;
			header("Location: ../evaluate.html");
		} 
		else {
			$errorMessage = "Invalid Login";
			session_start();
			$_SESSION['login'] = "0";
			$_SESSION['key'] = "";
			header("Location: ../index.html");
		}
	}
?>
