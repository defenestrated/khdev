<?php

if (isset($_POST)) {
	$name = $_POST["name"];
	$to = $_POST["to"];
	$from = $_POST["email"];
	$msg = $_POST["message"];
	$sub = $_POST["subject"];
	$head = "From: ".$name." <".$from.">" ."\r\n";
	
	$headers = "From: ". $name . " <" . $from . ">" . "\r\n" .
		"Reply-To: info@bellflowerproject.com" . "\r\n" .
		"X-Mailer: PHP/" . phpversion();
	$headers .= "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n";
	$subject = $sub;
	$emailBody = $msg;
		
	$mailSuccess = mail($to, $subject, $emailBody, $headers);
	
	$returnData = array(
		'posted_form_data' => array(
			'name' => $name,
			'to' => $to,
			'from' => $email,
			'subject' => $sub,
			'headers' => $headers,
			'message' => $msg
		),
		
		'mailSuccess' => $mailSuccess
	);
	
	echo( json_encode($returnData) );
	
}





?>