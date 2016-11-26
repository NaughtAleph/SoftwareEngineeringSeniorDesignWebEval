<?php
	session_start();
	if ($_SESSION["admin"] == 1) {
		$year = $_GET["year"];

		$presentations = file_get_contents("secrets/".$year."/presentations.json") or die("Unable to get presentations");
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
				$nullflag = false;
				foreach ($contents as $c) {
					if (in_array(null, $c->values, true)) {
						$nullflag = true;
						break;
					}
				}
				if ($nullflag) continue;
				array_push($scores, $contents);
			}
			if ($scores == []) continue;
			//echo json_encode($scores);
			//echo "\nAAAAAAAAAAHHHHHHHHHH\n";
			//echo json_encode($keys);;
			//echo "\nAAAAAAAAAAHHHHHHHHHH\n";
			//echo json_encode($presentations);
			foreach ($presentations as $p) {
				if ($p->key == $k) {
					$output = [	"Technical Accuracy",
							"Creativity and Innovation",
							"Supporting Analytical Work",
							"Methodical Design Process",
							"Addresses Project Complecity Appropriately",
							"Expectation of Completion",
							"Design & Analysis of Tests",
							"Quality of Response During Q&A",
							"Organization",
							"Use of Allotted Time",
							"Visual Aids",
							"Confidence and Poise",
							"Total"
						];
					$ref = $output;
					$num = intval($p->number);
					foreach ($scores as $s) {
						$total = 0;
						foreach ($s[$num-1]->values as $n=>$v) {
							$output[$n] = $output[$n].",".$v;
							if ($v == "N/A") continue;
							$total = $total + intval($v);
						}
						$output[12] = $output[12].",".$total;
						
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
		header("Content-Type: application/octet-stream");
		header("Content-Transfer-Encoding: Binary");
		header("Content-disposition: attachment; filename=\"reports.zip\"");
		readfile('reports.zip');
		unlink("reports.zip");
		foreach (glob("reports/*.csv") as $u) {
			unlink($u);
		}
	}
?>
