
$( document ).ready(function() {
	initMap();
	
	const ws = new SockJS( "/ws" );
	var stompClient = Stomp.over(ws);
	stompClient.debug = null;

	var thisheaders = {
        "Origin": "*",
        "withCredentials": 'false',
	};	 
	 
	stompClient.connect( thisheaders , (frame) => {
		console.log('WebSocket Conected.');  

		stompClient.subscribe('/particle', (message) => {
			let payload = JSON.parse( message.body );
		});

	});		


});

async function initMap(){
	
		Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzM2FmZWE0ZC02Mjk5LTQ4YjMtOTBkZS1lZTA2YmY1NmNlYjkiLCJpZCI6OTA0MCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1MzI2MDU2Nn0.7vt1o0l_yVOie6CCpPbPo91PaMmkZpdmqibvlFxpnpw';

		baseOsmProvider = new Cesium.OpenStreetMapImageryProvider({
		    url : 'https://a.tile.openstreetmap.org/'
		});
			
		map01 = new Cesium.UrlTemplateImageryProvider({
		    url : 'https://stamen-tiles-d.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
		});	
			
		map02 = new Cesium.UrlTemplateImageryProvider({
		    url : 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
		});	

		map03 = new Cesium.UrlTemplateImageryProvider({
		    url : 'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
		});	

		viewer = new Cesium.Viewer('cesiumContainer',{
			sceneMode : Cesium.SceneMode.SCENE3D,
			timeline: false,
			animation: false,
			baseLayerPicker: false,
			skyAtmosphere: false,
			fullscreenButton : false,
			geocoder : false,
			homeButton : false,
			infoBox : false,
			skyBox : false,
			sceneModePicker : true,
			selectionIndicator : false,
			navigationHelpButton : false,
		    imageryProvider: baseOsmProvider,
		    requestRenderMode : false,
		    
		    terrainProvider: await Cesium.CesiumTerrainProvider.fromUrl(
		      Cesium.IonResource.fromAssetId(1), {
		        requestVertexNormals: true
		    }),  		    
  		    
  		    contextOptions: { 
			  requestWebgl2: true,
			  webgl: {
				alpha: true,
			  }
			},			
		});
		
		
		const tileset = viewer.scene.primitives.add(
	      new Cesium.Cesium3DTileset({
	          url: Cesium.IonResource.fromAssetId(96188)
	      })
		);		
	
		camera = viewer.camera;
		scene = viewer.scene;
		canvas = viewer.canvas;

		scene.highDynamicRange = false; // HDR
		scene.globe.enableLighting = false;
		scene.screenSpaceCameraController.enableLook = false;
		scene.screenSpaceCameraController.enableCollisionDetection = true;
		scene.screenSpaceCameraController.inertiaZoom = 0;
		scene.screenSpaceCameraController.inertiaTranslate = 0;
		scene.screenSpaceCameraController.inertiaSpin = 0;
		scene.globe.depthTestAgainstTerrain = false;
		scene.pickTranslucentDepth = false;
		scene.useDepthPicking = false;
		scene.globe.tileCacheSize = 50;
		ellipsoid = viewer.scene.globe.ellipsoid;
		

		var imageryLayers = scene.imageryLayers;
		var helper = new Cesium.EventHelper();
		var totalTilesToLoad = 0;
		helper.add( viewer.scene.globe.tileLoadProgressEvent, function (event) {
			if( event > totalTilesToLoad ) totalTilesToLoad = event;
			if (event == 0) {
				$("#activeLayerContainer").height('90vh');
				var totalHeight= $("#activeLayerContainer").height() - 110 + 'px' ;
				$('#layerContainer').height( totalHeight );
			} else {
				//
			}
		});	

		
		imageryLayers.layerShownOrHidden.addEventListener(function (event) {
			//
		});
		imageryLayers.layerAdded.addEventListener(function (event) {
			//
		});
		imageryLayers.layerRemoved.addEventListener(function (event) {
			//
		});	
		
		// -18.813/
		var initialPosition = Cesium.Cartesian3.fromDegrees(-42, -19, 4000000);
		var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(0, -90, 0);
		scene.camera.setView({
		    destination: initialPosition,
		    orientation: initialOrientation,
		    endTransform: Cesium.Matrix4.IDENTITY
		});	
		
};

