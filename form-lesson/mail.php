
<?php 

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

// Получаем данные из POST запроса
$phone = $_POST['user_phone'] ?? '';
$to = $_POST['to'] ?? 'roladn.ttt@mail.ru';
$subject = $_POST['subject'] ?? 'Заказ книг';
$message = $_POST['message'] ?? '';

// Debug information
$logMessage = "Request received. To: $to, Subject: $subject";
error_log($logMessage);

$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.mail.ru';                         // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'rolandmam@mail.ru';                // Ваш логин от почты с которой будут отправляться письма
$mail->Password = 'eWTrFptCYkp67qf1KXPv';            // Ваш пароль от почты с которой будут отправляться письма
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to

// Fix potential SSL verification issues
$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);

$mail->setFrom('rolandmam@mail.ru');                  // от кого будет уходить письмо
$mail->addAddress($to);                               // Кому будет уходить письмо 

$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = $subject;
$mail->Body = $message ? $message : 'Нужны Книги: ' . $phone;
$mail->AltBody = strip_tags($message ? $message : 'Нужны Книги: ' . $phone);

// Отправляем письмо и формируем ответ
$response = array();

if ($mail->send()) {
    $response['status'] = 'success';
    $response['message'] = 'Письмо успешно отправлено';
    error_log("Email sent successfully to: $to");
} else {
    $response['status'] = 'error';
    $response['message'] = 'Ошибка при отправке: ' . $mail->ErrorInfo;
    error_log("Email error: " . $mail->ErrorInfo);
}

// Возвращаем ответ в формате JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
