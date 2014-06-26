var lon = -7.741;
var lat = 42.871;
var zoom = 9;
var map, centroidLayer, selectControl;
var periUrl = "http://twentyeigth.dyndns.org:55580/geo.php";
var centroidsUrl = "shapes/mvmc_centroids.geojson";
var marker;
var popup;
var markersLayer, markerPos;

function init(){
    map = new OpenLayers.Map('map',{ projection: new OpenLayers.Projection('EPSG:4326')}
			    );
    map.addControl(new OpenLayers.Control.LayerSwitcher({minimize:false}));
    map.addControl(new OpenLayers.Control.PanZoom());
    map.addControl(new OpenLayers.Control.ScaleLine());
    map.addControl(new OpenLayers.Control.OverviewMap({minimize:false}));
    map.addControl(new OpenLayers.Control.MousePosition());

var vectorLayer = new OpenLayers.Layer.Vector("top");


            
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
        fillColor: "#ff9909",
        //fillColor: "#cc1111",
        fillOpacity: 0.9,
        strokeColor: "#f15800",
        //strokeColor: "#cc1111",
        strokeWidth: 10,
        strokeOpacity: 0.4,
        label: "${count}",
        fontColor: "#ffffff"
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

    periLayer = new OpenLayers.Layer.Vector("Perimetros", {
	projection:"EPSG:4326" ,
	strategies: [bboxStrategy, refreshStrategy],//, clusterStrategy, refreshStrategy],
	protocol: new OpenLayers.Protocol.HTTP({
	    url: periUrl,
	    format: new OpenLayers.Format.GeoJSON()
	}),
    });
    periLayer.setVisibility(false);
    map.addLayer(periLayer);

    centroidLayer = new OpenLayers.Layer.Vector("Montes vecinhais en man comun", {
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
    map.addLayer(centroidLayer);
 
    selectControl = new OpenLayers.Control.SelectFeature(centroidLayer);
    map.addControl(selectControl);
    selectControl.activate();
    
    
    /*----------------------------------- video ------------------------------------*/
createMarkers();
            
         function createMarkers() {
        	markersLayer = new OpenLayers.Layer.Markers( "Markers" );
			map.addLayer(markersLayer);

			//var size = new OpenLayers.Size(21,31);
			//var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
			var icon = new OpenLayers.Icon('images/marker-blue.png');
			marker=new OpenLayers.Marker(markerPos, icon);
			marker.events.register('click', marker, markerClick);
			markersLayer.addMarker(marker);

        }

        function markerSimulClick() {
        	var el = OpenLayers.Util.getElement("enlace");
			marker.events.triggerEvent('click',marker.events);
        }

        function markerClick(evt) {
        	var position = this.events.getMousePosition(evt);

        	var lonlat = evt.object.lonlat;//map.getLonLatFromPixel(position);
        	if(popup == null){
				
        		popup = new OpenLayers.Popup("popup", lonlat,
        			new OpenLayers.Size(250,180),
        			"<span style='color: black; font-weight: bold;'> Streaming Comuneirx I Malla</span><br/>"+
        			"<object width='160' height='96'>"+
        			"<param name='movie' value='http://www.youtube-nocookie.com/v/gYcp5zuvZJE?version=3&amp;hl=es_ES&amp;hl=es_ES'></param>"+
        			"<param name='allowFullScreen' value='true'></param>"+
        			"<param name='allowscriptaccess' value='always'></param>"+
        			"<embed src='http://www.youtube-nocookie.com/v/gYcp5zuvZJE?version=3&amp;hl=es_ES&amp;hl=es_ES&autoplay=1&rel=0' "+
        			"type='application/x-shockwave-flash' allowscriptaccess='always' "+
        			"allowfullscreen='true'width='246' height='144' ></embed></object>",
    				false);
        		popup.setBackgroundColor("green");
        		popup.setBorder("1px solid green");
                        map.addPopup(popup);
        		}else{
        		popup.toggle();
        	}
        	OpenLayers.Event.stop(evt);
			
        }
    
    
    

    // Eventos
    // Activar o desactivar capa de perimetros según zoom
    map.events.on({ "zoomend": function (e) {
	if (this.getZoom() > 12) {
            periLayer.setVisibility(true);
	}
	else {
            periLayer.setVisibility(false);
	}
    }
                  });
    map.events.on({ "moveend": function (e) {
    }
                  });

    // eventos de selección
    centroidLayer.events.on({
        "featureselected": onFeatureSelect,
        "featureunselected": onFeatureUnselect
    });

//Engadir capa MapQuest

            var arrayOSM = ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
              "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
              "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
              "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg"];
            
            var mapQuest = new OpenLayers.Layer.OSM("MapQuest", arrayOSM);
            map.addLayer(mapQuest);

//INFO
    var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point( 2.200592, 41.40158 ).transform(epsg4326, projectTo),
            {description: '<div id="tot"><div id="subTit">PUNT D´INFORMACIÓ</div><br><div id="tit">CARPA TALLERS OBERTS</div><br>Rambla del Poble Nou amb C. Pujades<br><br>Dv 17:17 - 21h<br>Ds 18:10 - 14h / 16 - 20h<br>Dg 19:10 - 14h / 16 - 18h</div>'},
            {externalGraphic: 'img/numeros/info.png', graphicHeight: 35, graphicWidth: 35, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);
    map.addLayer(vectorLayer);
 
    
    //Add a selector control to the vectorLayer with popup functions
    var controls = {
      selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
    };

    function createPopup(feature) {
      feature.popup = new OpenLayers.Popup.FramedCloud("pop",
          feature.geometry.getBounds().getCenterLonLat(),
          null,
          '<div class="markerContent">'+feature.attributes.description+'</div>',
          null,
          true,
          function() { controls['selector'].unselectAll(); }
      );
      //feature.popup.closeOnMove = true;
      map.addPopup(feature.popup);
    }

    function destroyPopup(feature) {
      feature.popup.destroy();
      feature.popup = null;
    }

}

function onFeatureSelect(evt) {
    var feature = evt.feature;
    var content;
    
    if (!feature.cluster) {
        content = feature.attributes.NOMEMONTE +' ('+feature.attributes.PROVINCIA +')';
    } else if (feature.cluster.length == 1) {
        content = feature.cluster[0].attributes.NOMEMONTE +' ('+ feature.cluster[0].attributes.PROVINCIA+')';
    } else {
        content = '';
        var length = Math.min(feature.cluster.length, 50);
        for (var c = 0; c < length; c++) {
            content += feature.cluster[c].attributes.NOMEMONTE + '<br/>';
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


            


