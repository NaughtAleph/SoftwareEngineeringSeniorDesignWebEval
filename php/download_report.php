<?php
session_start();

/* Always check that the SESSION has the key 'admin' */
if (!array_key_exists('admin',$_SESSION)) {
        header("Location: ../login.html");
}

/* Always check that the caller is logged in */
if ($_SESSION["admin"] == 1) {

	/* Make sure that GET has the key 'year' */
	if (!array_key_exists('year', $_GET))
		header("Location: ../admin.html");
	$year = $_GET["year"];

	$presentations = file_get_contents("secrets/".$year."/presentations.json") or die("Unable to get presentations");
	$presentations = json_decode($presentations);
	$session = $presentations->sessioninfo;
	$presentations = $presentations->presentations;

	/* Sort the presentations by their key, then their number */
	usort($presentations, function($a, $b) {
		if ($a->key == $b->key) {
			return ($a->number < $b->number) ? -1 : 1;
		}
		return ($a->key < $b->key) ? -1 : 1;
	});

	$keys = [];
	/* Make an array of the session keys */
	foreach ($presentations as $p) {
		if (!in_array($p->key, $keys)) {
			array_push($keys, $p->key);
		}
	}

	/* Lock the folder "reports" for writing */
	$lock_file = fopen(".locker","w+");
	if (!flock($lock_file, LOCK_EX)) {
		die("Something went wrong. Someone is using the files already");
	}

	/* For each session, make a csv file from the scores */
	foreach ($keys as $k) {
		$files = glob("scores/".$year."/".$k."*");
		$scores = [];
		$judges = "Judge";

		/* Read the files that correspond to the current session */
		foreach ($files as $f) {
			$contents = file_get_contents($f);
			$contents = json_decode($contents);
			$nullflag = false;

			/* If any score is not filled out, skip the whole judge
			 * This was done with Shane Wibeto in mind, as he ignores any judges's
			 * scores if they didnt fill them out for everyone */
			foreach ($contents as $c) {
				if (in_array(null, $c->values, true)) {
					$nullflag = true;
					break;
				}
			}
			if ($nullflag) continue;
			array_push($scores, $contents);
			$base = basename($f, ".json");
			preg_match("/_(.*)/", $base, $matches);
			$judges = $judges.",".$matches[1];
		}

		/* Skip if this session has no pertinent scores */
		if ($scores == []) continue;

		/* Generate the csv file from the scores */
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
						"Total",
						"Average"
					];
				$ref = $output;
				$num = intval($p->number);
				$num_scores = 0;
				$pres_total = 0;
				foreach ($scores as $s) {
					$total = 0;
					foreach ($s[$num-1]->values as $n=>$v) {
						$output[$n] = $output[$n].",".$v;
						if ($v == "N/A") continue;
						$total = $total + intval($v);
					}
					$output[12] = $output[12].",".$total;
					$pres_total = $pres_total + $total;
					$num_scores += 1;
					
				}
				$output[13] = $output[13].",".($pres_total / $num_scores);

				/* If there were no scores, skip */
				if ($output == $ref) continue;

				/* Write to the csv file */
				file_put_contents("reports/".$session->$k->session.".csv", $p->title."\n", FILE_APPEND);
				file_put_contents("reports/".$session->$k->session.".csv", $judges."\n", FILE_APPEND);
				foreach ($output as $o) {
					file_put_contents("reports/".$session->$k->session.".csv", $o."\n", FILE_APPEND);
				}
				file_put_contents("reports/".$session->$k->session.".csv","\n\n\n", FILE_APPEND);
			}
		}
	}

	/* If there are no scores to download, die */
	if (count(scandir("reports")) == 2) die("There are no reports");

	/* Zip all the files and download the zip file */
	exec('zip reports.zip reports/*');
	header("Content-Type: application/octet-stream");
	header("Content-Transfer-Encoding: Binary");
	header("Content-disposition: attachment; filename=\"reports.zip\"");
	readfile('reports.zip');

	/* Delete any remnants */
	unlink("reports.zip");
	foreach (glob("reports/*.csv") as $u) {
		unlink($u);
	}

	/* Release the file lock */
	flock($lock_file, LOCK_UN);
	fclose($lock_file);
}
?>
