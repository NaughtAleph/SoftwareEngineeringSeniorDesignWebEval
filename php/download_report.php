<?php
	session_start();
	if ($_SESSION["admin"] == 1) {
		$year = $_GET["year"];

		$presentations = file_get_contents("secrets/presentations.json") or die("Unable to get presentations");
		$presentations = json_decode($presentations);
		$session = $presentations->sessioninfo;
		$presentations = $presentations->presentations;
		usort($presentations, function($a, $b) {
			if ($a->key == $b->key) {
				return ($a->number < $b->number) ? -1 : 1;
			}
			return ($a->key < $b->key) ? -1 : 1;
		});


		$keys = [];
		foreach ($presentations as $p) {
			if (!in_array($p->key, $keys)) {
				array_push($keys, $p->key);
			}
		}
		foreach ($keys as $k) {
			$files = glob("scores/".$year."/".$k."*");
			$scores = [];
			foreach ($files as $f) {
				$contents = file_get_contents($f);
				$contents = json_decode($contents);
				array_push($scores, $contents);
			}
			//echo json_encode($scores);
			//echo "\nAAAAAAAAAAHHHHHHHHHH\n";
			//echo json_encode($keys);;
			//echo "\nAAAAAAAAAAHHHHHHHHHH\n";
			//echo json_encode($presentations);
			foreach ($presentations as $p) {
				if ($p->key == $k) {
					$output = ["","","","","","","","","","","",""];
					$ref = $output;
					$num = intval($p->number);
					foreach ($scores as $s) {
						foreach ($s[$num-1]->values as $n=>$v) {
							$output[$n] = $output[$n].$v.",";
						}
						
					}
					if ($output == $ref) continue;
					file_put_contents("reports/".$session->$k->session.".csv", $p->title."\n", FILE_APPEND);
					foreach ($output as $o) {
						file_put_contents("reports/".$session->$k->session.".csv", $o."\n", FILE_APPEND);
					}
					file_put_contents("reports/".$session->$k->session.".csv","\n", FILE_APPEND);
				}
			}
		}
		
		exec('zip reports.zip reports/*');
		header("Content-Type: application/octec-stream");
		header("Content-Transfer-Encoding: Binary");
		header("Content-disposition: attachment; filename=\"reports.zip\"");
		readfile('reports.zip');
		unlink("reports.zip");
		foreach (glob("reports/*.csv") as $u) {
			unlink($u);
		}
	}
?>
