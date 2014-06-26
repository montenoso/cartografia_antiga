var lon = -7.741;
var lat = 42.871;
var zoom = 9;
var map, centroidLayer, selectControl;
var periUrl = "http://twentyeigth.dyndns.org:55580/geo.php";
var centroidsUrl = "shapes/mvmc_centroids.geojson";

function init(){
    map = new OpenLayers.Map('map',{ projection: new OpenLayers.Projection('EPSG:4326')}
			    );
    map.addControl(new OpenLayers.Control.LayerSwitcher());
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

    periLayer = new OpenLayers.Layer.Vector("perimetrosMontes", {
	projection:"EPSG:4326" ,
	strategies: [bboxStrategy, refreshStrategy],//, clusterStrategy, refreshStrategy],
	protocol: new OpenLayers.Protocol.HTTP({
	    url: periUrl,
	    format: new OpenLayers.Format.GeoJSON()
	}),
    });
    periLayer.setVisibility(false);
    map.addLayer(periLayer);

    centroidLayer = new OpenLayers.Layer.Vector("centroidMontes", {
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

};

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



