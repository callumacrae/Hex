<?php

$working = array('I', 'am','a','simple','sentence','that','was','split','using','explode.','Not','really','but','consider','as','if.');
$new = '';

for ($i = 6; $i < count($working); $i++) {
	$new .= $working[$i] . ' ';
}

$new = trim($new);

var_dump($working, count($working), $new);

