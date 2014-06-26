 <?php
session_start();
include("conecta.php");
include("class.phpmailer.php");
include("class.smtp.php");
?>
                           <?php
                              $descripcion=$_POST['descripcion'];
                              $nombre=$_POST['nombre'];
                              $mailUs=$_POST['mailUs'];
                              $mail = new PHPMailer();
                                $mail->CharSet = 'UTF-8';
                                $mail->Encoding = "quoted-printable";
                                $mail->IsSMTP();
                                $mail->SMTPAuth = true;
                                $mail->SMTPSecure = "ssl";
                                $mail->Host = "smtp.gmail.com";
                                $mail->Port = 465;
                                $mail->Username = "omontenoso@gmail.com";
                                $mail->Password = "sachador";
                                $mail->From = "user@domain.com";
                                $mail->FromName = "Contacto a través da cartogarfía";
                                $mail->Subject = "Mensaxe cartogarfía";
                                $mail->AltBody = "Mensaxe de usuarix";
                                $mail->MsgHTML("Esta é unha mensaxe de:$nombre <br>Cóntanos o seguinte: $descripcion <br> O seu mail é $mailUs <br> Respostémoslle aixiña!!!!");
                                $mail->AddAddress("omontenoso@gmail.com", "Destinatario");
                                $mail->IsHTML(true);
                                
                          
                    if(!$mail->Send()) {
                    echo "Error: " . $mail->ErrorInfo;
                    } else {
                    echo "Mensaje enviado correctamente";
                    header("Location: http://montenoso.net/cartografia/index.php");

}
?>
