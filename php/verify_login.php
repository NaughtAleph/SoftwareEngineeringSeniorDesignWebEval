<?php
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		$uname = $_POST['uname'];
		$pass = $_POST['pass'];
		$cont = file_get_contents(__DIR__ . "/secrets/sessionkeys.json") or die("Unable to get login info");
		$login = json_decode($cont, true);
		if (!array_key_exists($uname, $login['login'])) {
			session_start();
			$_SESSION['admin'] = "0";
			$_SESSION['name'] = '';
			header("Location: ../login.html");
			die();
		}
		$hash = $login['login'][$uname];
		if (password_verify($pass, $hash)) {
			session_start();
			$_SESSION['admin'] = "1";
			$_SESSION['name'] = $uname;
			header("Location: ../admin.html");
		} else {
			session_start();
			$_SESSION['admin'] = "0";
			$_SESSION['name'] = '';
			header("Location: ../login.html");
		}
	}
?>
