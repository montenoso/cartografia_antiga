<?php
session_start();
include("conecta.php");

    $sql = "SELECT longitud, latitud, selectedradio FROM documento ORDER BY fecha_inser DESC";
    $consulta = mysql_query($sql) or die ("No se pudo ejecutar la consulta");
    $datos = mysql_query($sql, $conexion);
                            
    $longitudes=  array();
    $latitudes=  array();
    $selectedradios=  array();
    while ($resultado = mysql_fetch_assoc($datos)) {
        $longitud = $resultado['longitud'];
        $latitud = $resultado['latitud'];
        $selectedradio = $resultado['selectedradio'];
                                        
        array_push($longitudes, $longitud);
        array_push($latitudes, $latitud);
        array_push($selectedradios, $selectedradio);
    }
                                        
    $longitudesJson = json_encode($longitudes);
    $latitudesJson = json_encode($latitudes);
    $selectedradiosJson = json_encode($selectedradios);
    echo "hola";
?> 
                    {
    "longitudes": <?php echo $longitudesJson; ?>,
    "latitudes": <?php echo $latitudesJson; ?>,
    "selectedradios": <?php echo $selectedradiosJson; ?>
    }
    
<script language="JavaScript" type="text/javascript" src="js/verTodo.js"></script>
