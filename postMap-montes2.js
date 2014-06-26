var flag=0;
var positionMarker;
var iconos = new Array();
iconos[0] = "images/marcadores/foto.png";
iconos[1] = "images/marcadores/video.png";
iconos[2] = "images/marcadores/audio.png";
iconos[3] = "images/marcadores/texto.png";
//iconos[4] = "iconos_png/";
var icono;
var lon = -7.741;
var lat = 42.871;
var zoom = 9;
var map, centroidLayer; //selectControl;
var periUrl = "http://212.36.84.20/postgis2geojson.php";
var centroidsUrl = "shapes/mvmc_centroids.geojson";


function init(){
    map = new OpenLayers.Map('map',{ projection: new OpenLayers.Projection('EPSG:4326')}
			    );
 
 var switcherControl = new OpenLayers.Control.LayerSwitcher();
OpenLayers.Lang[OpenLayers.Lang.getCode()]['Base Layer'] = "Tipo de mapa";
OpenLayers.Lang[OpenLayers.Lang.getCode()]['Overlays'] = "Capas de información";

map.addControl(switcherControl);
switcherControl.maximizeControl();
 
    map.addControl(new OpenLayers.Control.PanZoom());
    map.addControl(new OpenLayers.Control.ScaleLine());
    map.addControl(new OpenLayers.Control.OverviewMap({minimize:false}));
    
   var overview = new OpenLayers.Control.OverviewMap({
        maximized: true,
    });
    map.addControl(overview);      
            
    map.addControl(new OpenLayers.Control.MousePosition());

      
    OSM_layer = new OpenLayers.Layer.OSM();
    OSM_layer.transitionEffect = 'resize';
    map.addLayer(OSM_layer);
       
    map.setCenter(new OpenLayers.LonLat(lon, lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
    ), zoom);
    
    // var geojson_format = new OpenLayers.Format.GeoJSON();
    // var vector_layer = new OpenLayers.Layer.Vector(); 
    // map.addLayer(vector_layer);
    //vector_layer.addFeatures(geojson_format.read(featurecollection));

    fixedStrategy = new OpenLayers.Strategy.Fixed();
    bboxStrategy = new OpenLayers.Strategy.BBOX();
    clusterStrategy = new OpenLayers.Strategy.Cluster({
        distance: 50,
        threshold: 1
    });
    refreshStrategy = new OpenLayers.Strategy.Refresh({
        force: true,
        active: true
    });
    style = new OpenLayers.Style({
       pointRadius: "${radius}",
        fillColor: "#000000",
        //fillColor: "#cc1111",
        fillOpacity: 0.9,
        strokeColor: "#218A45",
        //strokeColor: "#cc1111",
        strokeWidth: 10,
        strokeOpacity: 0.4,
        label: "${count}",
        fontColor: "#ffffff",
    },{
        context: {
            radius: function(feature) {
                return Math.min(Math.max(feature.attributes.count, 7), 20);
            },
            count: function(feature) {
                return feature.attributes.count;
            }
        }
    });

    periLayer = new OpenLayers.Layer.Vector("Perímetros", {
	projection:"EPSG:4326" ,
	strategies: [bboxStrategy, refreshStrategy],//, clusterStrategy, refreshStrategy],
	protocol: new OpenLayers.Protocol.HTTP({
	    url: periUrl,
	    format: new OpenLayers.Format.GeoJSON()
	}),
    });
    periLayer.setVisibility(false);
   

    centroidLayer = new OpenLayers.Layer.Vector("Montes asociados por densidade", {
	projection:"EPSG:4326" ,
	strategies: [fixedStrategy, clusterStrategy],// refreshStrategy],
	protocol: new OpenLayers.Protocol.HTTP({
	    url: centroidsUrl,
	    format: new OpenLayers.Format.GeoJSON()
	}),
        styleMap: new OpenLayers.StyleMap({
            "default": style,
            "select": {
                fillColor: "#8aeeef",
                strokeColor: "#32a8a9"
            }
        })
    });
    



//Engadir capa MapQuest

            var arrayOSM = ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
              "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
              "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
              "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg"];
            
            var mapQuest = new OpenLayers.Layer.OSM("MapQuest", arrayOSM);
            map.addLayer(mapQuest);
         
               
//Aerial

        arrayAerial = ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
                        "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
                        "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
                        "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"];
        

        baseAerial = new OpenLayers.Layer.OSM("Aéreo", arrayAerial);
       
        map.addLayer(baseAerial);
  
        
              
/////////////////////////////////CAPA MARKERS
  


 markers = new OpenLayers.Layer.Markers( "Markers" );
    markers.id = "Markers";
    map.addLayer(markers);		
       
    var size = new OpenLayers.Size(32,37); //tamaño del icono!!!
    var offset = new OpenLayers.Pixel(-(size.w), -size.h);
    
    //alert(selectedradiosJs[1]);
    console.log("ENTRA MARKERS");
    //selectedradiosJs = eval(<?php echo $selectedradiosJson; ?>);
    //console.log(selectedradiosJs[1]);
    for(i=0; i< markersdata.length;i++){
       
        //document.write(selectedradiosJs[i]);
       
        //console.log(markersdata[i].selectedradio);
        switch(markersdata[i].selectedradio){
            
            case "foto":
                icono = iconos[0];
            break;
            case "video":
                icono = iconos[1];
            break;
            case "audio":
                icono = iconos[2];
            break;
            default :
                icono = iconos[3];
        }                        
        //new OpenLayers.Layer.Markers(idmaterial[i]);
        //var idmaterial[i] = new OpenLayers.Marker(new OpenLayers.LonLat(longitudesJs[i],latitudesJs[i]),icon));
        //markers.addMarker(idmaterial[i]);
        var icon = new OpenLayers.Icon(icono, size, offset);
        var newmarker=new OpenLayers.Marker(new OpenLayers.LonLat(markersdata[i].longitud,markersdata[i].latitud),icon);
        newmarker.documentoId=markersdata[i].material_id;
        newmarker.nombre = markersdata[i].titulo_registro;
        newmarker.events.register('mouseover', newmarker, function(evt) { console.log(this.documentoId); OpenLayers.Event.stop(evt); $("#info_marcador").html(this.nombre); });
        newmarker.events.register('click', newmarker, function(evt) { 
            console.log("ENTRA ");
             if (this.documentoId=="")
  {
  document.getElementById("map").innerHTML="";
  return;
  } 
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    document.getElementById("map").innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("GET","ficha.php?id="+this.documentoId,true);
xmlhttp.send();
console.log("ENTRA ");
                  
        OpenLayers.Event.stop(evt);  });
        
        markers.addMarker(newmarker);
        
        //var sourceMarker=new OpenLayers.Marker(location,icon)
    
    
    }    
         
}