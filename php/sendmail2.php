<?php

$to = $_POST['to'];
$email = $_POST['email'];
$name = $_POST['name'];
$subject = $_POST['subject'];
$message = $_POST['message'];

$headers = 'From: ' . $name . ' <' . $email  . '>' . "\r\n" .
    'Reply-To: ' . $name . ' <' . $email  . '>' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

$mailSuccess = mail($to, $subject, $message, $headers);

$spitup = array(
    'form_data' => array(
        'to'        =>  $to,
        'email'     =>  $email,
        'name'      =>  $name,
        'subject'   =>  $subject,
        'message'   =>  $message
        ),
    
    'mailSuccess' => $mailSuccess
);

echo json_encode($spitup);

?>