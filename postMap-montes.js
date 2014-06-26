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
OpenLayers.Lang[OpenLayers.Lang.getCode()]['Overlays'] = "Capas de información.";  
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

//    fixedStrategy = new OpenLayers.Strategy.Fixed();
//    bboxStrategy = new OpenLayers.Strategy.BBOX();
//    clusterStrategy = new OpenLayers.Strategy.Cluster({
//        distance: 50,
//        threshold: 1
//    });
//    refreshStrategy = new OpenLayers.Strategy.Refresh({
//        force: true,
//        active: true
//    });
//    style = new OpenLayers.Style({
//       pointRadius: "${radius}",
//        fillColor: "#000000",
//        //fillColor: "#cc1111",
//        fillOpacity: 0.9,
//        strokeColor: "#218A45",
//        //strokeColor: "#cc1111",
//        strokeWidth: 10,
//        strokeOpacity: 0.4,
//        label: "${count}",
//        fontColor: "#ffffff",
//    },{
//        context: {
//            radius: function(feature) {
//                return Math.min(Math.max(feature.attributes.count, 7), 20);
//            },
//            count: function(feature) {
//                return feature.attributes.count;
//            }
//        }
//    });

//    periLayer = new OpenLayers.Layer.Vector("Perímetros", {
//	projection:"EPSG:4326" ,
//	strategies: [bboxStrategy, refreshStrategy],//, clusterStrategy, refreshStrategy],
//	protocol: new OpenLayers.Protocol.HTTP({
//	    url: periUrl,
//	    format: new OpenLayers.Format.GeoJSON()
//	}),
//    });
//    periLayer.setVisibility(false);
//    map.addLayer(periLayer);

//    centroidLayer = new OpenLayers.Layer.Vector("Montes asociados por densidade", {
//	projection:"EPSG:4326" ,
//	strategies: [fixedStrategy, clusterStrategy],// refreshStrategy],
//	protocol: new OpenLayers.Protocol.HTTP({
//	    url: centroidsUrl,
//	    format: new OpenLayers.Format.GeoJSON()
//	}),
//        styleMap: new OpenLayers.StyleMap({
//            "default": style,
//            "select": {
//                fillColor: "#8aeeef",
//                strokeColor: "#32a8a9"
//            }
//        })
//    });
//    map.addLayer(centroidLayer);
 













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
         
////////////////////////////////////////////////////////////// CAPA FORM ///////////////////////////////////////////////////////////////

//   epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
//    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)
   
//    var lonLat = new OpenLayers.LonLat( -7.741 ,42.871 ).transform(epsg4326, projectTo);
          
//    var zoom=9;
//    map.setCenter (lonLat, zoom);
  
//    var vectorLayer = new OpenLayers.Layer.Vector("Comunidades visitadas");
    
//    // Define markers as "features" of the vector layer:
//    // Define markers as "features" of the vector layer:
////argozón
//    var feature = new OpenLayers.Feature.Vector(
//            new OpenLayers.Geometry.Point( -7.871107,42.661153 ).transform(epsg4326, projectTo),
//            {description: '<div id="tot"><div id="tit">O FARO DE ARGOZÓN (Chantada)</div><br><img src="images/argozon.jpg"><br/><br/><b> <input type="button" href="javascript:void(0);" value ="RELATO ARGOZÓN" onclick="Cargar1()"></b><br/>  '},
//            {externalGraphic: 'images/marcadores/proba.gif', graphicHeight: 37, graphicWidth: 32, graphicXOffset:-12, graphicYOffset:-25  }
//        );    
//    vectorLayer.addFeatures(feature);
////ombre
//    var feature = new OpenLayers.Feature.Vector(
//            new OpenLayers.Geometry.Point( -8.259322, 43.00788 ).transform(epsg4326, projectTo),
//            {description:'<div id="tot"><div id="tit">OMBRE (A Coruña)</div><br><img src="images/ombre.jpg"><br/><br/><b><input type="button" href="javascript:void(0);" value ="RELATO OMBRE" onclick="Cargar2()"> </b><br/>  '},
//            {externalGraphic: 'images/marcadores/proba.gif', graphicHeight: 37, graphicWidth: 32, graphicXOffset:-12, graphicYOffset:-25  }
//        );    
//    vectorLayer.addFeatures(feature);
////mouriscados
//    var feature = new OpenLayers.Feature.Vector(
//            new OpenLayers.Geometry.Point( -8.416046, 42.191088 ).transform(epsg4326, projectTo),
//            {description: '<div id="tot"><div id="tit">MOURISCADOS (Pontevedra)</div><br><img src="images/mouriscados.jpg"><br/> <b><input type="button" href="javascript:void(0);" value ="RELATO MOURISCADOS" onclick="Cargar5()"> </b><br/>'},
//            {externalGraphic:'images/marcadores/proba.gif', graphicHeight: 37, graphicWidth: 32, graphicXOffset:-12, graphicYOffset:-25  }
//        );    
//    vectorLayer.addFeatures(feature);
////vilamateo
//    var feature = new OpenLayers.Feature.Vector(
//            new OpenLayers.Geometry.Point( -8.145529, 43.347043 ).transform(epsg4326, projectTo),
//            {description: '<div id="tot"><div id="tit">VILAMATEO (Vilarmaior)</div><br><img src="images/vilamateo.jpg"><br/><b><input type="button" href="javascript:void(0);" value ="RELATO VILAMATEO" onclick="Cargar3()"> </b><br/>  '},
//            {externalGraphic: 'images/marcadores/proba.gif', graphicHeight: 37, graphicWidth: 32, graphicXOffset:-12, graphicYOffset:-25  }
//        );    
//    vectorLayer.addFeatures(feature);

////Guillade
//    var feature = new OpenLayers.Feature.Vector(
//            new OpenLayers.Geometry.Point(-8.432529, 42.168556 ).transform(epsg4326, projectTo),
//            {description: '<div id="tot"><div id="tit">GUILLADE (Pontevedra)</div><br><img src="images/guillade.jpg"><br/><b><b><input type="button" href="javascript:void(0);" value ="RELATO GUILLADE" onclick="Cargar4()"> </b><br/>  '},
//            {externalGraphic: 'images/marcadores/proba.gif', graphicHeight: 37, graphicWidth: 32, graphicXOffset:-12, graphicYOffset:-25  }
//        );    
//    vectorLayer.addFeatures(feature);

//    map.addLayer(vectorLayer);
    


//// Configuración de eventos

    selectControl = new OpenLayers.Control.SelectFeature([centroidLayer,vectorLayer]);
    map.addControl(selectControl);
    selectControl.activate();


    // Eventos
//    // Activar o desactivar capa de perimetros segÃºn zoom
//    map.events.on({ "zoomend": function (e) {
//	if (this.getZoom() > 12) {
//            periLayer.setVisibility(true);
//	}
//	else {
//            periLayer.setVisibility(false);
//	}
//    }
//                  });
//    map.events.on({ "moveend": function (e) {
//    }
//                  });

//    // eventos de selecciÃ³n
//    centroidLayer.events.on({
//        "featureselected": onFeatureSelect,
//        "featureunselected": onFeatureUnselect
//    });
//    vectorLayer.events.on({
//        "featureselected": onFeatureSelect,
//        "featureunselected": onFeatureUnselect
   // });
   
}


// Funciones para eventos

function onFeatureSelect(evt) {
    var feature = evt.feature;
    var content;

    if (!feature.cluster) {
        content = '<div class="markerContent">'+feature.attributes.description+'</div>';
    } else if (feature.cluster.length == 1) {
        content = feature.cluster[0].attributes.NOMEMONTE + '<br>' + 'HectÃ¡reas: ' + feature.cluster[0].attributes.SUPERFICIE + '<br>' + 'Parroquia: ' + feature.cluster[0].attributes.NOMEPERTEN + '<br>' + 'Comarca: ' + feature.cluster[0].attributes.DISTRITO + '<br>' + 'Concello: ' +feature.cluster[0].attributes.CONCELLO + '<br>' + 'Provincia: ' + feature.cluster[0].attributes.PROVINCIA;
    } else {
        content = '';
        var length = Math.min(feature.cluster.length, 50);
        for (var c = 0; c < length; c++) {
            content += feature.cluster[c].attributes.NOMEMONTE + '<br/>';
            content += 'HectÃ¡reas: ' + feature.cluster[c].attributes.SUPERFICIE + '<br/>';
            content += 'Parroquia: ' + feature.cluster[c].attributes.NOMEPERTEN + '<br/>';
            content += 'Comarca: ' + feature.cluster[c].attributes.DISTRITO + '<br/>';
            content += 'Concello: ' + feature.cluster[c].attributes.CONCELLO + '<br/>';
            content += 'Provincia: ' + feature.cluster[c].attributes.PROVINCIA + '<br/>' + '<br/>';
        }
        if (length < feature.cluster.length) {
            content += '(...)';
        }
    }
    var self = this;

    var popup = new OpenLayers.Popup.FramedCloud(
	'featurePopup', 
	feature.geometry.getBounds().getCenterLonLat(),
	new OpenLayers.Size(300, 100),
	content, null, true,
	function(evt) {
	    var feature = this.feature;
	    if (feature.layer) {
		selectControl.unselect(feature);
	    } else {
		this.destroy();
	    }
	}
    );

    popup.maxSize = new OpenLayers.Size(500, 300);
    feature.popup = popup;
    popup.feature = feature;
    map.addPopup(popup, true);
};

function onFeatureUnselect(evt) {
    var feature = evt.feature;
    if (feature.popup) {
        feature.popup.feature = null;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
};




            


