<?php
$db = pg_connect('host=212.36.84.20 port=5432 dbname=gis_noso user=enoso_gis password=brA6Ha8PA57spEp');
//$query = "select nomemonte,provincia,st_asgeojson(geom) from mvmc limit 200"; //"SELECT * FROM mvmc where alt<='$_POST[sliderValue]'";

/*ATENCIÓN SE HA DE LIMPIAR EL BBOX ANTES DE PASARLO A PG PARA EVITAR PROBLEMAS DE SQL INJECTION*/

$query = "select nomemonte,provincia,st_asgeojson(geom) 
    from mvmc 
    where mvmc.geom && ST_MakeEnvelope(".$_GET['bbox'].") limit 10"; 
$result = pg_query($query);
// Return route as GeoJSON
  
$res = '{"type": "FeatureCollection", "features": [';
  
while($row=pg_fetch_array($result)) {  

   $res .= '{"type": "Feature", "properties": {"NOMEMONTE": "' . $row[0] . '", "PROVINCIA": "' . $row[1] . '"}, "geometry": '  .  $row[2] . '},';
}
$res[strlen($res)-1] = ' ';
$res .= ']}';

pg_close($db);

// Return routing result
header("Content-Type:application/json",true);
//header("Location:map.html");
echo $res;
?>