<?php
// En-têtes de sécurité
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Type: application/json; charset=UTF-8');

// Configuration CORS stricte
$allowed_origin = (defined('ENV') && ENV === 'production') ? SITE_URL : '*';
header('Access-Control-Allow-Origin: ' . $allowed_origin);
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Rate limiting basique
session_start();
$ip = $_SERVER['REMOTE_ADDR'];
$current_time = time();
$rate_limit_key = 'rate_limit_' . md5($ip);

if (!isset($_SESSION[$rate_limit_key])) {
    $_SESSION[$rate_limit_key] = ['count' => 1, 'time' => $current_time];
} else {
    $time_diff = $current_time - $_SESSION[$rate_limit_key]['time'];

    if ($time_diff < 60) {
        $_SESSION[$rate_limit_key]['count']++;

        if ($_SESSION[$rate_limit_key]['count'] > 5) {
            http_response_code(429);
            echo json_encode(['success' => false, 'message' => 'Trop de requêtes. Veuillez patienter.']);
            exit;
        }
    } else {
        $_SESSION[$rate_limit_key] = ['count' => 1, 'time' => $current_time];
    }
}

// Charger la configuration
require_once __DIR__ . '/config.php';

// Charger PHPMailer classes si disponibles
if (file_exists(__DIR__ . '/PHPMailer/PHPMailer.php')) {
    require __DIR__ . '/PHPMailer/PHPMailer.php';
    require __DIR__ . '/PHPMailer/SMTP.php';
    require __DIR__ . '/PHPMailer/Exception.php';
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Récupérer les données
$data = json_decode(file_get_contents('php://input'), true);

$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Le nom doit contenir au moins 2 caractères';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email invalide';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Le message doit contenir au moins 10 caractères';
}

// Honeypot anti-spam
if (!empty($data['honeypot'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Erreur de validation']);
    exit;
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Nettoyer les données
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Utiliser PHPMailer si disponible, sinon mail()
if (file_exists(__DIR__ . '/PHPMailer/PHPMailer.php')) {
    // Version avec PHPMailer (pour Mailtrap)
    $mail = new PHPMailer(true);

    try {
        // Configuration SMTP
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION;
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';

        // Expéditeur et destinataire
        $mail->setFrom(SMTP_FROM_EMAIL, 'Portfolio Contact');
        $mail->addAddress(CONTACT_EMAIL);
        $mail->addReplyTo($email, $name);

        // Contenu
        $mail->isHTML(true);
        $mail->Subject = "Nouveau message de $name via le portfolio";
        $mail->Body = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #667eea; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>📧 Nouveau message de contact</h2>
                </div>
                <div class='content'>
                    <div class='field'>
                        <p class='label'>Nom :</p>
                        <p>$name</p>
                    </div>
                    <div class='field'>
                        <p class='label'>Email :</p>
                        <p><a href='mailto:$email'>$email</a></p>
                    </div>
                    <div class='field'>
                        <p class='label'>Message :</p>
                        <p>" . nl2br($message) . "</p>
                    </div>
                    <hr>
                    <p style='font-size: 12px; color: #999;'>Message envoyé le " . date('d/m/Y à H:i') . "</p>
                </div>
            </div>
        </body>
        </html>
        ";

        $mail->send();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Message envoyé avec succès ! Je vous répondrai rapidement.'
        ]);

    } catch (Exception $e) {
        error_log("Erreur PHPMailer: {$mail->ErrorInfo}");
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de l\'envoi. Veuillez réessayer.'
        ]);
    }

} else {
    // Fallback avec mail() natif (pour O2switch en production)
    $to = CONTACT_EMAIL;
    $subject = "Nouveau message de $name via le portfolio";
    $headers = [
        'From: ' . SMTP_FROM_EMAIL,
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8'
    ];

    $emailBody = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #667eea; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>📧 Nouveau message de contact</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <p class='label'>Nom :</p>
                    <p>$name</p>
                </div>
                <div class='field'>
                    <p class='label'>Email :</p>
                    <p><a href='mailto:$email'>$email</a></p>
                </div>
                <div class='field'>
                    <p class='label'>Message :</p>
                    <p>" . nl2br($message) . "</p>
                </div>
                <hr>
                <p style='font-size: 12px; color: #999;'>Message envoyé le " . date('d/m/Y à H:i') . "</p>
            </div>
        </div>
    </body>
    </html>
    ";

    try {
        $success = mail($to, $subject, $emailBody, implode("\r\n", $headers));

        if ($success) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Message envoyé avec succès ! Je vous répondrai rapidement.'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi. Veuillez réessayer.'
            ]);
        }
    } catch (\Exception $e) {
        error_log('Erreur envoi email: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de l\'envoi. Veuillez réessayer.'
        ]);
    }
}